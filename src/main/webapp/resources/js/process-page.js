//*****************************************************YYsegmentation***************************//
/**
 * @constructor
 * @extends DraggingTool
 * @class
 * This draggingTool class makes guidelines visible as the parts are dragged around a diagram
 * when the selected part is nearly aligned with another part.
 */
function GuidedDraggingTool() {
  yy.DraggingTool.call(this);

  // temporary parts for horizonal guidelines
  var $ = yy.GraphObject.make;
  var partProperties = { layerName: "Tool", isInDocumentBounds: false };
  var shapeProperties = { stroke: "gray", isGeometryPositioned: true };
  /** @ignore */
  this.guidelineHtop =
    $(yy.Part, partProperties,
      $(yy.Shape, shapeProperties, { geometryString: "M0 0 100 0" }));
  /** @ignore */
  this.guidelineHbottom =
    $(yy.Part, partProperties,
      $(yy.Shape, shapeProperties, { geometryString: "M0 0 100 0" }));
  /** @ignore */
  this.guidelineHcenter =
    $(yy.Part, partProperties,
      $(yy.Shape, shapeProperties, { geometryString: "M0 0 100 0" }));
  // temporary parts for vertical guidelines
  /** @ignore */
  this.guidelineVleft =
    $(yy.Part, partProperties,
      $(yy.Shape, shapeProperties, { geometryString: "M0 0 0 100" }));
  /** @ignore */
  this.guidelineVright =
    $(yy.Part, partProperties,
      $(yy.Shape, shapeProperties, { geometryString: "M0 0 0 100" }));
  /** @ignore */
  this.guidelineVcenter =
    $(yy.Part, partProperties,
      $(yy.Shape, shapeProperties, { geometryString: "M0 0 0 100" }));

  // properties that the programmer can modify
  /** @type {number} */
  this._guidelineSnapDistance = 6;
  /** @type {boolean} */
  this._isGuidelineEnabled = true;
  /** @type {string} */
  this._horizontalGuidelineColor = "gray";
  /** @type {string} */
  this._verticalGuidelineColor = "gray";
  /** @type {string} */
  this._centerGuidelineColor = "gray";
  /** @type {number} */
  this._guidelineWidth = 1;
  /** @type {number} */
  this._searchDistance = 1000;
  /** @type {boolean} */
  this._isGuidelineSnapEnabled = true;
}
yy.Diagram.inherit(GuidedDraggingTool, yy.DraggingTool);

/**
 * Removes all of the guidelines from the grid.
 * @this {GuidedDraggingTool}
 */
GuidedDraggingTool.prototype.clearGuidelines = function () {
  this.diagram.remove(this.guidelineHbottom);
  this.diagram.remove(this.guidelineHcenter);
  this.diagram.remove(this.guidelineHtop);
  this.diagram.remove(this.guidelineVleft);
  this.diagram.remove(this.guidelineVright);
  this.diagram.remove(this.guidelineVcenter);
}

/**
 * Calls the base method from {@link DraggingTool#doDeactivate}
 * and removes the guidelines from the graph.
 * @this {GuidedDraggingTool}
 */
GuidedDraggingTool.prototype.doDeactivate = function () {
  yy.DraggingTool.prototype.doDeactivate.call(this);
  // clear any guidelines when dragging is done
  this.clearGuidelines();
};

GuidedDraggingTool.prototype.doDragOver = function (pt, obj) {
  // clear all existing guidelines in case either show... method decides to show a guideline
  this.clearGuidelines();

  // gets the selected part
  var partItr = (this.copiedParts || this.draggedParts).iterator;
  partItr.next();
  var part = partItr.key;
  if (part) {
    this.showHorizontalMatches(part, this.isGuidelineEnabled, false);
    this.showVerticalMatches(part, this.isGuidelineEnabled, false);
  }
}

/**
 * On a mouse-up, snaps the selected part to the nearest guideline.
 * If no guidelines are showing, the part remains at its position.
 * This calls {@link #guidelineSnap}.
 * @this {GuidedDraggingTool}
 */
GuidedDraggingTool.prototype.doDropOnto = function (pt, obj) {
  // gets the selected (perhaps copied) Part
  var partItr = (this.copiedParts || this.draggedParts).iterator;
  partItr.next();
  var part = partItr.key;

  // snaps only when the mouse is released without shift modifier
  var e = this.diagram.lastInput;
  var snap = this.isGuidelineSnapEnabled && !e.shift;
  if (part) {
    this.showHorizontalMatches(part, this.isGuidelineEnabled, snap);
    this.showVerticalMatches(part, this.isGuidelineEnabled, snap);
  }
}

/**
 * This finds parts that are aligned near the selected part along horizontal lines. It compares the selected
 * part to all parts within a rectangle approximately twice the {@link #searchDistance} wide.
 * The guidelines appear when a part is aligned within a margin-of-error equal to {@link #guidelineSnapDistance}.
 * The parameters used for {@link #guidelineSnap} are also set here.
 * @this {GuidedDraggingTool}
 * @param {Part} part
 * @param {boolean} guideline if true, show guideline
 * @param {boolean} snap if true, snap the part to where the guideline would be
 */
GuidedDraggingTool.prototype.showHorizontalMatches = function (part, guideline, snap) {
  var partBounds = part.actualBounds;
  var p0 = partBounds.y;
  var p1 = partBounds.y + partBounds.height / 2;
  var p2 = partBounds.y + partBounds.height;

  var marginOfError = this.guidelineSnapDistance;
  var distance = this.searchDistance;
  // compares with parts within narrow vertical area
  var area = partBounds.copy();
  area.inflate(distance, marginOfError + 1);
  var otherParts = this.diagram.findObjectsIn(area,
    function (obj) {
      return obj.part;
    },
    function (part) {
      return part instanceof yy.Part && !(part instanceof yy.Link) && part.isTopLevel && !part.layer.isTemporary;
    },
    true);

  var bestDiff = marginOfError;
  var bestPart = null;
  var bestSpot;
  var bestOtherSpot;
  // horizontal line -- comparing y-values
  otherParts.each(function (other) {
    if (other === part) return; // ignore itself

    var otherBounds = other.actualBounds;
    var q0 = otherBounds.y;
    var q1 = otherBounds.y + otherBounds.height / 2;
    var q2 = otherBounds.y + otherBounds.height;

    // compare center with center of OTHER part
    if (Math.abs(p1 - q1) < bestDiff) {
      bestDiff = Math.abs(p1 - q1);
      bestPart = other;
      bestSpot = yy.Spot.Center;
      bestOtherSpot = yy.Spot.Center;
    }

    // compare top side with top and bottom sides of OTHER part
    if (Math.abs(p0 - q0) < bestDiff) {
      bestDiff = Math.abs(p0 - q0);
      bestPart = other;
      bestSpot = yy.Spot.Top;
      bestOtherSpot = yy.Spot.Top;
    }
    else if (Math.abs(p0 - q2) < bestDiff) {
      bestDiff = Math.abs(p0 - q2);
      bestPart = other;
      bestSpot = yy.Spot.Top;
      bestOtherSpot = yy.Spot.Bottom;
    }

    // compare bottom side with top and bottom sides of OTHER part
    if (Math.abs(p2 - q0) < bestDiff) {
      bestDiff = Math.abs(p2 - q0);
      bestPart = other;
      bestSpot = yy.Spot.Bottom;
      bestOtherSpot = yy.Spot.Top;
    }
    else if (Math.abs(p2 - q2) < bestDiff) {
      bestDiff = Math.abs(p2 - q2);
      bestPart = other;
      bestSpot = yy.Spot.Bottom;
      bestOtherSpot = yy.Spot.Bottom;
    }
  });

  if (bestPart !== null) {
    var bestBounds = bestPart.actualBounds;
    // line extends from x0 to x2
    var x0 = Math.min(partBounds.x, bestBounds.x) - 10;
    var x2 = Math.max(partBounds.x + partBounds.width, bestBounds.x + bestBounds.width) + 10;
    // find bestPart's desired Y
    var bestPoint = new yy.Point().setRectSpot(bestBounds, bestOtherSpot);
    if (bestSpot === yy.Spot.Center) {
      if (snap) {
        // call Part.move in order to automatically move member Parts of Groups
        part.move(new yy.Point(partBounds.x, bestPoint.y - partBounds.height / 2));
      }
      if (guideline) {
        this.guidelineHcenter.position = new yy.Point(x0, bestPoint.y);
        this.guidelineHcenter.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHcenter);
      }
    } else if (bestSpot === yy.Spot.Top) {
      if (snap) {
        part.move(new yy.Point(partBounds.x, bestPoint.y));
      }
      if (guideline) {
        this.guidelineHtop.position = new yy.Point(x0, bestPoint.y);
        this.guidelineHtop.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHtop);
      }
    } else if (bestSpot === yy.Spot.Bottom) {
      if (snap) {
        part.move(new yy.Point(partBounds.x, bestPoint.y - partBounds.height));
      }
      if (guideline) {
        this.guidelineHbottom.position = new yy.Point(x0, bestPoint.y);
        this.guidelineHbottom.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHbottom);
      }
    }
  }
}

/**
 * This finds parts that are aligned near the selected part along vertical lines. It compares the selected
 * part to all parts within a rectangle approximately twice the {@link #searchDistance} tall.
 * The guidelines appear when a part is aligned within a margin-of-error equal to {@link #guidelineSnapDistance}.
 * The parameters used for {@link #guidelineSnap} are also set here.
 * @this {GuidedDraggingTool}
 * @param {Part} part
 * @param {boolean} guideline if true, show guideline
 * @param {boolean} snap if true, don't show guidelines but just snap the part to where the guideline would be
 */
GuidedDraggingTool.prototype.showVerticalMatches = function (part, guideline, snap) {
  var partBounds = part.actualBounds;
  var p0 = partBounds.x;
  var p1 = partBounds.x + partBounds.width / 2;
  var p2 = partBounds.x + partBounds.width;

  var marginOfError = this.guidelineSnapDistance;
  var distance = this.searchDistance;
  // compares with parts within narrow vertical area
  var area = partBounds.copy();
  area.inflate(marginOfError + 1, distance);
  var otherParts = this.diagram.findObjectsIn(area,
    function (obj) {
      return obj.part;
    },
    function (part) {
      return part instanceof yy.Part && !(part instanceof yy.Link) && part.isTopLevel && !part.layer.isTemporary;
    },
    true);

  var bestDiff = marginOfError;
  var bestPart = null;
  var bestSpot;
  var bestOtherSpot;
  // vertical line -- comparing x-values
  otherParts.each(function (other) {
    if (other === part) return; // ignore itself

    var otherBounds = other.actualBounds;
    var q0 = otherBounds.x;
    var q1 = otherBounds.x + otherBounds.width / 2;
    var q2 = otherBounds.x + otherBounds.width;

    // compare center with center of OTHER part
    if (Math.abs(p1 - q1) < bestDiff) {
      bestDiff = Math.abs(p1 - q1);
      bestPart = other;
      bestSpot = yy.Spot.Center;
      bestOtherSpot = yy.Spot.Center;
    }

    // compare left side with left and right sides of OTHER part
    if (Math.abs(p0 - q0) < bestDiff) {
      bestDiff = Math.abs(p0 - q0);
      bestPart = other;
      bestSpot = yy.Spot.Left;
      bestOtherSpot = yy.Spot.Left;
    }
    else if (Math.abs(p0 - q2) < bestDiff) {
      bestDiff = Math.abs(p0 - q2);
      bestPart = other;
      bestSpot = yy.Spot.Left;
      bestOtherSpot = yy.Spot.Right;
    }

    // compare right side with left and right sides of OTHER part
    if (Math.abs(p2 - q0) < bestDiff) {
      bestDiff = Math.abs(p2 - q0);
      bestPart = other;
      bestSpot = yy.Spot.Right;
      bestOtherSpot = yy.Spot.Left;
    }
    else if (Math.abs(p2 - q2) < bestDiff) {
      bestDiff = Math.abs(p2 - q2);
      bestPart = other;
      bestSpot = yy.Spot.Right;
      bestOtherSpot = yy.Spot.Right;
    }
  });

  if (bestPart !== null) {
    var bestBounds = bestPart.actualBounds;
    // line extends from y0 to y2
    var y0 = Math.min(partBounds.y, bestBounds.y) - 10;
    var y2 = Math.max(partBounds.y + partBounds.height, bestBounds.y + bestBounds.height) + 10;
    // find bestPart's desired X
    var bestPoint = new yy.Point().setRectSpot(bestBounds, bestOtherSpot);
    if (bestSpot === yy.Spot.Center) {
      if (snap) {
        // call Part.move in order to automatically move member Parts of Groups
        part.move(new yy.Point(bestPoint.x - partBounds.width / 2, partBounds.y));
      }
      if (guideline) {
        this.guidelineVcenter.position = new yy.Point(bestPoint.x, y0);
        this.guidelineVcenter.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVcenter);
      }
    } else if (bestSpot === yy.Spot.Left) {
      if (snap) {
        part.move(new yy.Point(bestPoint.x, partBounds.y));
      }
      if (guideline) {
        this.guidelineVleft.position = new yy.Point(bestPoint.x, y0);
        this.guidelineVleft.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVleft);
      }
    } else if (bestSpot === yy.Spot.Right) {
      if (snap) {
        part.move(new yy.Point(bestPoint.x - partBounds.width, partBounds.y));
      }
      if (guideline) {
        this.guidelineVright.position = new yy.Point(bestPoint.x, y0);
        this.guidelineVright.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVright);
      }
    }
  }
}

/**
 * Gets or sets the margin of error for which guidelines show up.
 * The default value is 6.
 * Guidelines will show up when the aligned nods are ± 6px away from perfect alignment.
 * @name GuidedDraggingTool#guidelineSnapDistance
 * @function.
 * @return {number}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "guidelineSnapDistance", {
  get: function () {
    return this._guidelineSnapDistance;
  },
  set: function (val) {
    if (typeof val !== "number" || isNaN(val) || val < 0) throw new Error("new value for GuidedDraggingTool.guidelineSnapDistance must be a non-negative number.");
    if (this._guidelineSnapDistance !== val) {
      this._guidelineSnapDistance = val;
    }
  }
});

/**
 * Gets or sets whether the guidelines are enabled or disable.
 * The default value is true.
 * @name GuidedDraggingTool#isGuidelineEnabled
 * @function.
 * @return {boolean}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "isGuidelineEnabled", {
  get: function () {
    return this._isGuidelineEnabled;
  },
  set: function (val) {
    if (typeof val !== "boolean") throw new Error("new value for GuidedDraggingTool.isGuidelineEnabled must be a boolean value.");
    if (this._isGuidelineEnabled !== val) {
      this._isGuidelineEnabled = val;
    }
  }
});

/**
 * Gets or sets the color of horizontal guidelines.
 * The default value is "gray".
 * @name GuidedDraggingTool#horizontalGuidelineColor
 * @function.
 * @return {string}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "horizontalGuidelineColor", {
  get: function () {
    return this._horizontalGuidelineColor;
  },
  set: function (val) {
    if (this._horizontalGuidelineColor !== val) {
      this._horizontalGuidelineColor = val;
      this.guidelineHbottom.elements.first().stroke = this._horizontalGuidelineColor;
      this.guidelineHtop.elements.first().stroke = this._horizontalGuidelineColor;
    }
  }
});

/**
 * Gets or sets the color of vertical guidelines.
 * The default value is "gray".
 * @name GuidedDraggingTool#verticalGuidelineColor
 * @function.
 * @return {string}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "verticalGuidelineColor", {
  get: function () {
    return this._verticalGuidelineColor;
  },
  set: function (val) {
    if (this._verticalGuidelineColor !== val) {
      this._verticalGuidelineColor = val;
      this.guidelineVleft.elements.first().stroke = this._verticalGuidelineColor;
      this.guidelineVright.elements.first().stroke = this._verticalGuidelineColor;
    }
  }
});

/**
 * Gets or sets the color of center guidelines.
 * The default value is "gray".
 * @name GuidedDraggingTool#centerGuidelineColor
 * @function.
 * @return {string}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "centerGuidelineColor", {
  get: function () {
    return this._centerGuidelineColor;
  },
  set: function (val) {
    if (this._centerGuidelineColor !== val) {
      this._centerGuidelineColor = val;
      this.guidelineVcenter.elements.first().stroke = this._centerGuidelineColor;
      this.guidelineHcenter.elements.first().stroke = this._centerGuidelineColor;
    }
  }
});

/**
 * Gets or sets the width guidelines.
 * The default value is 1.
 * @name GuidedDraggingTool#guidelineWidth
 * @function.
 * @return {number}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "guidelineWidth", {
  get: function () {
    return this._guidelineWidth;
  },
  set: function (val) {
    if (typeof val !== "number" || isNaN(val) || val < 0) throw new Error("New value for GuidedDraggingTool.guidelineWidth must be a non-negative number.");
    if (this._guidelineWidth !== val) {
      this._guidelineWidth = val;
      this.guidelineVcenter.elements.first().strokeWidth = val;
      this.guidelineHcenter.elements.first().strokeWidth = val;
      this.guidelineVleft.elements.first().strokeWidth = val;
      this.guidelineVright.elements.first().strokeWidth = val;
      this.guidelineHbottom.elements.first().strokeWidth = val;
      this.guidelineHtop.elements.first().strokeWidth = val;
    }
  }
});
/**
 * Gets or sets the distance around the selected part to search for aligned parts.
 * The default value is 1000.
 * Set this to Infinity if you want to search the entire diagram no matter how far away.
 * @name GuidedDraggingTool#searchDistance
 * @function.
 * @return {number}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "searchDistance", {
  get: function () {
    return this._searchDistance;
  },
  set: function (val) {
    if (typeof val !== "number" || isNaN(val) || val <= 0) throw new Error("new value for GuidedDraggingTool.searchDistance must be a positive number.");
    if (this._searchDistance !== val) {
      this._searchDistance = val;
    }
  }
});

/**
 * Gets or sets whether snapping to guidelines is enabled.
 * The default value is true.
 * @name GuidedDraggingTool#isGuidelineSnapEnabled
 * @function.
 * @return {Boolean}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "isGuidelineSnapEnabled", {
  get: function () {
    return this._isGuidelineSnapEnabled;
  },
  set: function (val) {
    if (typeof val !== "boolean") throw new Error("new value for GuidedDraggingTool.isGuidelineSnapEnabled must be a boolean.");
    if (this._isGuidelineSnapEnabled !== val) {
      this._isGuidelineSnapEnabled = val;
    }
  }
});

function DrawCommandHandler() {
  yy.CommandHandler.call(this);
  this._arrowKeyBehavior = "move";
}
yy.Diagram.inherit(DrawCommandHandler, yy.CommandHandler);

/**
 * This controls whether or not the user can invoke the {@link #alignLeft}, {@link #alignRight},
 * {@link #alignTop}, {@link #alignBottom}, {@link #alignCenterX}, {@link #alignCenterY} commands.
 * @this {DrawCommandHandler}
 * @return {boolean}
 * This returns true:
 * if the diagram is not {@link Diagram#isReadOnly},
 * if the model is not {@link Model#isReadOnly}, and
 * if there are at least two selected {@link Part}s.
 */
DrawCommandHandler.prototype.canAlignSelection = function () {
  var diagram = this.diagram;
  if (diagram === null || diagram.isReadOnly || diagram.isModelReadOnly)
    return false;
  if (diagram.selection.count < 2)
    return false;
  return true;
};

/**
 * Aligns selected parts along the left-most edge of the left-most part.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype.alignLeft = function () {
  var diagram = this.diagram;
  diagram.startTransaction("aligning left");
  var minPosition = Infinity;
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    minPosition = Math.min(current.position.x, minPosition);
  });
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    current.move(new yy.Point(minPosition, current.position.y));
  });
  diagram.commitTransaction("aligning left");
};

/**
 * Aligns selected parts at the right-most edge of the right-most part.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype.alignRight = function () {
  var diagram = this.diagram;
  diagram.startTransaction("aligning right");
  var maxPosition = -Infinity;
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    var rightSideLoc = current.actualBounds.x + current.actualBounds.width;
    maxPosition = Math.max(rightSideLoc, maxPosition);
  });
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    current.move(new yy.Point(maxPosition - current.actualBounds.width, current.position.y));
  });
  diagram.commitTransaction("aligning right");
};

/**
 * Aligns selected parts at the top-most edge of the top-most part.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype.alignTop = function () {
  var diagram = this.diagram;
  diagram.startTransaction("alignTop");
  var minPosition = Infinity;
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    minPosition = Math.min(current.position.y, minPosition);
  });
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    current.move(new yy.Point(current.position.x, minPosition));
  });
  diagram.commitTransaction("alignTop");
};

/**
 * Aligns selected parts at the bottom-most edge of the bottom-most part.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype.alignBottom = function () {
  var diagram = this.diagram;
  diagram.startTransaction("aligning bottom");
  var maxPosition = -Infinity;
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    var bottomSideLoc = current.actualBounds.y + current.actualBounds.height;
    maxPosition = Math.max(bottomSideLoc, maxPosition);
  });
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    current.move(new yy.Point(current.actualBounds.x, maxPosition - current.actualBounds.height));
  });
  diagram.commitTransaction("aligning bottom");
};

/**
 * Aligns selected parts at the x-value of the center point of the first selected part.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype.alignCenterX = function () {
  var diagram = this.diagram;
  var firstSelection = diagram.selection.first();
  if (!firstSelection)
    return;
  diagram.startTransaction("aligning Center X");
  var centerX = firstSelection.actualBounds.x + firstSelection.actualBounds.width / 2;
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    current.move(new yy.Point(centerX - current.actualBounds.width / 2, current.actualBounds.y));
  });
  diagram.commitTransaction("aligning Center X");
};

/**
 * Aligns selected parts at the y-value of the center point of the first selected part.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype.alignCenterY = function () {
  var diagram = this.diagram;
  var firstSelection = diagram.selection.first();
  if (!firstSelection)
    return;
  diagram.startTransaction("aligning Center Y");
  var centerY = firstSelection.actualBounds.y + firstSelection.actualBounds.height / 2;
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    current.move(new yy.Point(current.actualBounds.x, centerY - current.actualBounds.height / 2));
  });
  diagram.commitTransaction("aligning Center Y");
};

/**
 * Aligns selected parts top-to-bottom in order of the order selected.
 * Distance between parts can be specified. Default distance is 0.
 * @this {DrawCommandHandler}
 * @param {number} distance
 */
DrawCommandHandler.prototype.alignColumn = function (distance) {
  var diagram = this.diagram;
  diagram.startTransaction("align Column");
  if (distance === undefined)
    distance = 0; // for aligning edge to edge
  distance = parseFloat(distance);
  var selectedParts = new Array();
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    selectedParts.push(current);
  });
  for (var i = 0; i < selectedParts.length - 1; i++) {
    var current = selectedParts[i];
    // adds distance specified between parts
    var curBottomSideLoc = current.actualBounds.y + current.actualBounds.height + distance;
    var next = selectedParts[i + 1];
    next.move(new yy.Point(current.actualBounds.x, curBottomSideLoc));
  }
  diagram.commitTransaction("align Column");
};

/**
 * Aligns selected parts left-to-right in order of the order selected.
 * Distance between parts can be specified. Default distance is 0.
 * @this {DrawCommandHandler}
 * @param {number} distance
 */
DrawCommandHandler.prototype.alignRow = function (distance) {
  if (distance === undefined)
    distance = 0; // for aligning edge to edge
  distance = parseFloat(distance);
  var diagram = this.diagram;
  diagram.startTransaction("align Row");
  var selectedParts = new Array();
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link)
      return; // skips over yy.Link
    selectedParts.push(current);
  });
  for (var i = 0; i < selectedParts.length - 1; i++) {
    var current = selectedParts[i];
    // adds distance specified between parts
    var curRightSideLoc = current.actualBounds.x + current.actualBounds.width + distance;
    var next = selectedParts[i + 1];
    next.move(new yy.Point(curRightSideLoc, current.actualBounds.y));
  }
  diagram.commitTransaction("align Row");
};

/**
 * This controls whether or not the user can invoke the {@link #rotate} command.
 * @this {DrawCommandHandler}
 * @param {number=} angle the positive (clockwise) or negative (counter-clockwise) change in the rotation angle of each Part, in degrees.
 * @return {boolean}
 * This returns true:
 * if the diagram is not {@link Diagram#isReadOnly},
 * if the model is not {@link Model#isReadOnly}, and
 * if there is at least one selected {@link Part}.
 */
DrawCommandHandler.prototype.canRotate = function (number) {
  var diagram = this.diagram;
  if (diagram === null || diagram.isReadOnly || diagram.isModelReadOnly)
    return false;
  if (diagram.selection.count < 1)
    return false;
  return true;
};

/**
 * Change the angle of the parts connected with the given part. This is in the command handler
 * so it can be easily accessed for the purpose of creating commands that change the rotation of a part.
 * @this {DrawCommandHandler}
 * @param {number=} angle the positive (clockwise) or negative (counter-clockwise) change in the rotation angle of each Part, in degrees.
 */
DrawCommandHandler.prototype.rotate = function (angle) {
  if (angle === undefined)
    angle = 90;
  var diagram = this.diagram;
  diagram.startTransaction("rotate " + angle.toString());
  var diagram = this.diagram;
  diagram.selection.each(function (current) {
    if (current instanceof yy.Link || current instanceof yy.Group)
      return; // skips over Links and Groups
    current.angle += angle;
  });
  diagram.commitTransaction("rotate " + angle.toString());
};

/**
 * This implements custom behaviors for arrow key keyboard events.
 * Set {@link #arrowKeyBehavior} to "select", "move" (the default), "scroll" (the standard behavior), or "none"
 * to affect the behavior when the user types an arrow key.
 * @this {DrawCommandHandler}*/
DrawCommandHandler.prototype.doKeyDown = function () {
  var diagram = this.diagram;
  if (diagram === null)
    return;
  var e = diagram.lastInput;

  // determines the function of the arrow keys
  if (e.key === "Up" || e.key === "Down" || e.key === "Left" || e.key === "Right") {

    var behavior = this.arrowKeyBehavior;
    if (behavior === "none") {
      // no-op
      return;
    } else if (behavior === "select") {
      this._arrowKeySelect();
      return;
    } else if (behavior === "move") {
      this._arrowKeyMove();
      return;
    }
    // otherwise drop through to get the default scrolling behavior
  }

  // otherwise still does all standard commands
  yy.CommandHandler.prototype.doKeyDown.call(this);
};

/**
 * Collects in an Array all of the non-Link Parts currently in the Diagram.
 * @this {DrawCommandHandler}
 * @return {Array}
 */
DrawCommandHandler.prototype._getAllParts = function () {
  var allParts = new Array();
  this.diagram.nodes.each(function (node) {
    allParts.push(node);
  });
  this.diagram.parts.each(function (part) {
    allParts.push(part);
  });
  // note that this ignores Links
  return allParts;
};

/**
 * To be called when arrow keys should move the Diagram.selection.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype._arrowKeyMove = function () {
  var diagram = this.diagram;
  var e = diagram.lastInput;
  // moves all selected parts in the specified direction
  var vdistance = 0;
  var hdistance = 0;
  // if control is being held down, move pixel by pixel. Else, moves by grid cell size
  if (e.control || e.meta) {
    vdistance = 1;
    hdistance = 1;
  } else if (diagram.grid !== null) {
    var cellsize = diagram.grid.gridCellSize;
    hdistance = cellsize.width;
    vdistance = cellsize.height;
  }
  diagram.startTransaction("arrowKeyMove");
  diagram.selection.each(function (part) {
    if (e.key === "Up") {
      part.move(new yy.Point(part.actualBounds.x, part.actualBounds.y - vdistance));
    } else if (e.key === "Down") {
      part.move(new yy.Point(part.actualBounds.x, part.actualBounds.y + vdistance));
    } else if (e.key === "Left") {
      part.move(new yy.Point(part.actualBounds.x - hdistance, part.actualBounds.y));
    } else if (e.key === "Right") {
      part.move(new yy.Point(part.actualBounds.x + hdistance, part.actualBounds.y));
    }
  });
  diagram.commitTransaction("arrowKeyMove");
};

/**
 * To be called when arrow keys should change selection.
 * @this {DrawCommandHandler}
 */
DrawCommandHandler.prototype._arrowKeySelect = function () {
  var diagram = this.diagram;
  var e = diagram.lastInput;
  // with a part selected, arrow keys change the selection
  // arrow keys + shift selects the additional part in the specified direction
  // arrow keys + control toggles the selection of the additional part
  var nextPart = null;
  if (e.key === "Up") {
    nextPart = this._findNearestPartTowards(270);
  } else if (e.key === "Down") {
    nextPart = this._findNearestPartTowards(90);
  } else if (e.key === "Left") {
    nextPart = this._findNearestPartTowards(180);
  } else if (e.key === "Right") {
    nextPart = this._findNearestPartTowards(0);
  }
  if (nextPart !== null) {
    if (e.shift) {
      nextPart.isSelected = true;
    } else if (e.control || e.meta) {
      nextPart.isSelected = !nextPart.isSelected;
    } else {
      diagram.select(nextPart);
    }
  }
};

/**
 * Finds the nearest Part in the specified direction, based on their center points.
 * if it doesn't find anything, it just returns the current Part.
 * @this {DrawCommandHandler}
 * @param {number} dir the direction, in degrees
 * @return {Part} the closest Part found in the given direction
 */
DrawCommandHandler.prototype._findNearestPartTowards = function (dir) {
  var originalPart = this.diagram.selection.first();
  if (originalPart === null)
    return null;
  var originalPoint = originalPart.actualBounds.center;
  var allParts = this._getAllParts();
  var closestDistance = Infinity;
  var closest = originalPart; // if no parts meet the criteria, the same part remains selected

  for (var i = 0; i < allParts.length; i++) {
    var nextPart = allParts[i];
    if (nextPart === originalPart)
      continue; // skips over currently selected part
    var nextPoint = nextPart.actualBounds.center;
    var angle = originalPoint.directionPoint(nextPoint);
    var anglediff = this._angleCloseness(angle, dir);
    if (anglediff <= 45) { // if this part's center is within the desired direction's sector,
      var distance = originalPoint.distanceSquaredPoint(nextPoint);
      distance *= 1 + Math.sin(anglediff * Math.PI / 180); // the more different from the intended angle, the further it is
      if (distance < closestDistance) { // and if it's closer than any other part,
        closestDistance = distance; // remember it as a better choice
        closest = nextPart;
      }
    }
  }
  return closest;
};

/**
 * @this {DrawCommandHandler}
 * @param {number} a
 * @param {number} dir
 * @return {number}
 */
DrawCommandHandler.prototype._angleCloseness = function (a, dir) {
  return Math.min(Math.abs(dir - a), Math.min(Math.abs(dir + 360 - a), Math.abs(dir - 360 - a)));
};

/**
 * Gets or sets the arrow key behavior. Possible values are "move", "select", and "scroll".
 * The default value is "move".
 * @name DrawCommandHandler#arrowKeyBehavior
 * @function.
 * @return {string}
 */
Object.defineProperty(DrawCommandHandler.prototype, "arrowKeyBehavior", {
  get: function () {
    return this._arrowKeyBehavior;
  },
  set: function (val) {
    if (val !== "move" && val !== "select" && val !== "scroll" && val !== "none") {
      throw new Error("DrawCommandHandler.arrowKeyBehavior must be either \"move\", \"select\", \"scroll\", or \"none\", not: " + val);
    }
    this._arrowKeyBehavior = val;
  }
});

// PoolLink, a special Link class for message flows from edges of pools

function PoolLink() {
  yy.Link.call(this);
}
yy.Diagram.inherit(PoolLink, yy.Link);

PoolLink.prototype.getLinkPoint = function (node, port, spot, from, ortho, othernode, otherport) {
  var r = new yy.Rect(port.getDocumentPoint(yy.Spot.TopLeft),
    port.getDocumentPoint(yy.Spot.BottomRight));
  var op = yy.Link.prototype.getLinkPoint.call(this, othernode, otherport, spot, from, ortho, node, port);

  var below = op.y > r.centerY;
  var y = below ? r.bottom : r.top;
  if (node.category === "privateProcess") {
    if (op.x < r.left)
      return new yy.Point(r.left, y);
    if (op.x > r.right)
      return new yy.Point(r.right, y);
    return new yy.Point(op.x, y);
  } else { // otherwise get the standard link point by calling the base class method
    return yy.Link.prototype.getLinkPoint.call(this, node, port, spot, from, ortho, othernode, otherport);
  }
};

// If there are two links from & to same node... and pool is offset in X from node... the link toPoints collide on pool
PoolLink.prototype.computeOtherPoint = function (othernode, otherport) {
  var op = yy.Link.prototype.computeOtherPoint(this, othernode, otherport);
  var node = this.toNode;
  if (node === othernode)
    node = this.fromNode;
  if (othernode.category === "privateProcess") {
    op.x = node.getDocumentPoint(yy.Spot.MiddleBottom).x;
  }
  return op;
};

PoolLink.prototype.getLinkDirection = function (node, port, linkpoint, spot, from, ortho, othernode, otherport) {
  if (node.category === "privateProcess") {
    var p = port.getDocumentPoint(yy.Spot.Center);
    var op = otherport.getDocumentPoint(yy.Spot.Center);
    var below = op.y > p.y;
    return below ? 90 : 270;
  } else {
    return yy.Link.prototype.getLinkDirection.call(this, node, port, linkpoint, spot, from, ortho, othernode, otherport);
  }
};

// BPMNLinkingTool, a custom linking tool to switch the class of the link created.

function BPMNLinkingTool() {
  yy.LinkingTool.call(this);
  // don't allow user to create link starting on the To node
  this.direction = yy.LinkingTool.ForwardsOnly;
  this.temporaryLink.routing = yy.Link.Orthogonal;
}
yy.Diagram.inherit(BPMNLinkingTool, yy.LinkingTool);

BPMNLinkingTool.prototype.insertLink = function (fromnode, fromport, tonode, toport) {
  var lsave = null;
  // maybe temporarily change the link data that is copied to create the new link
  if (fromnode.category === "privateProcess" || tonode.category === "privateProcess") {
    lsave = this.archetypeLinkData;
    this.archetypeLinkData = {
      category: "msg"
    };
  }

  // create the link in the standard manner by calling the base method
  var newlink = yy.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);

  // maybe make the label visible
  if (fromnode.category === "gateway") {
    var label = newlink.findObject("Label");
    if (label !== null)
      label.visible = true;
  }

  // maybe restore the original archetype link data
  if (lsave !== null)
    this.archetypeLinkData = lsave;
  return newlink;
};

var contentEditor = {
  dataSource: null,
  showContentEditor: function (target) {
    showEditorPanel();
    var linesArray = contentEditor.viewModel.record;
    var data = [];
    for (var i = 0, len = linesArray.length, sentence; i < len; i++) {
      var obj = {};
      sentence = linesArray[i];
      obj['sentence'] = sentence.text;
      obj['ID'] = sentence.id;
      data.push(obj);
    }
    contentEditor.dataSource = new kendo.data.DataSource({
      data: data,
      batch: false,
      pageSize: 20,
      schema: {
        model: {
          id: "ID",
          fields: {
            ID: { editable: false, nullable: true },
            sentence: { validation: { required: true } }
          }
        }
      }
    });

    $("#editorPanel").kendoGrid({
      dataSource: contentEditor.dataSource,
      pageable: true,
      height: 680,
      toolbar: ["create"],
      columns: [
        {field: "ID", title: "ID", width: "150px"},
        { field: "sentence", title: "Sentence", width: "600px" },
        { command: [
          {text: "play", click: playVideo},
          "edit",
          "destroy"
        ], title: "Action", width: "250px" }
      ],
      editable: "inline"
    });
    function playVideo(event) {
      if ($('#ttsAudio').length === 0) {
        $('body').append('<audio id="ttsAudio" autoplay="autoplay" oncanplay="cleanMark()"> </audio>');
      }
      makeMark('#editorPanel');
      var id = $(event.target).parent().parent().find('td:first-child').html();
      var text = $(event.target).parent().parent().find('td:nth-child(2)').html();
      var key = function () {
        var i = myDiagram.selection.iterator;
        return i.next(), i.value.data.key;
      }();
      $.ajax({
        url: getBasePath() + '/web/processController/obtainAudioPath',
        data: {
          processId: $('#processId').val(), shapeId: key, content: text
        },
        type: 'post',
        cache: false,
        dataType: 'text',
        success: function (data) {
          if (data == 'EMPTY') {
            alert("can't get the audio");
          } else {
            var videoElement = $('#ttsAudio');
            videoElement[0].src = data;
            videoElement[0].load();
          }
        },
        error: function () {
          alert("error");
          cleanMark();
        }
      });
    }

    function showEditorPanel() {
      $(target).parent().css('position', 'relative');
      if ($('#editorPanel').length === 0) {
        $('<div id="editorPanel" style="position: absolute;right:0;top:0;min-width: 1100px; height: 700px;overflow:visible;background:white;border:1px solid #ccc;z-index:999;text-align: left;"></div>').appendTo($(target).parent());
      } else {
        $('#editorPanel').show();
      }
    }
  },
  cleanEditorPanel: function () {
    $('#editorPanel').html('');
  },
//  putResultInContainer: function () {
//    var result = $('.k-grid-content tr>td:nth-child(2)').map(function (i, e) {
//      return $(e).html() + '\n';
//    });
//    $('#ProContent').val([].slice.call(result).join(''));
//  },
  putIDIntoContentList: function (id) {
    $('.k-grid-content tr:first-child>td:nth-child(1)').html(id);
  },
  viewModel: {
    fieldModel: [
      {name: "text", type: "string"},
      {name: "id", type: "string"}
    ],
    record: [],
    listeners: {
      onCreate: function (id, from) {
        contentEditor.putIDIntoContentList(id);
        if (from === 'listView') {
          contentEditor.viewModel.record.unshift({text: '', id: id});
          contentEditor.dataSource._data[0].ID = contentEditor.dataSource._data[0].id = id;
        }
      },
      onRefresh: function (dataSource, from) {
        contentEditor.viewModel.record = dataSource;
      },
      onUpdate: function (newRecord, from) {
        var dataArray = contentEditor.viewModel.record;
        var _arr = [];
        for (var i = 0, item, _obj; i < dataArray.length; i++) {
          _obj = {};
          item = dataArray[i];
          if (item.id === newRecord.id) {
            _obj['text'] = newRecord.text;
          } else {
            _obj['text'] = item.text;
          }
          _obj['id'] = item.id;
          _arr.push(_obj);
        }
        contentEditor.viewModel.record = _arr;
      },
      onDelete: function (from) {
      }
    }
  },
  listeners: {
    onActive: function (target) {
      contentEditor.showContentEditor(target);
    },
    onDeactive: function () {
      $('#editorPanel .k-grid-cancel').click();
      $('#editorPanel').hide();
//      this.putResultInContainer();
      this.cleanEditorPanel();
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      $('#ProContent')[0].dispatchEvent(evt);
    }
  }
};

/**======================Init===========================*/
var _$ = yy.GraphObject.make; // for more concise visual tree definitions
var defaultNodeFill = _$(yy.Brush, yy.Brush.Linear, {
  0: "rgb(243, 244, 249)",
  1: "rgb(236, 234, 253)"
});
// constants for design choices
var gradYellow = _$(yy.Brush, yy.Brush.Linear, {
  0: "LightGoldenRodYellow ",
  1: "#FFFF66"
});
var gradLightGreen = _$(yy.Brush, yy.Brush.Linear, {
  0: "#E0FEE0",
  1: "PaleGreen"
});
var gradLightRed = _$(yy.Brush, yy.Brush.Linear, {
  0: "#FFCBCB",
  1: "#FFC0CB"
});
var gradLightGray = _$(yy.Brush, yy.Brush.Linear, {
  0: "White",
  1: "#DADADA"
});
var defaultStroke = '#7762C3';
function init() {
  if (typeof(Storage) === "undefined") {
    var currentFile = document.getElementById("currentFile");
    currentFile.textContent = "Sorry! No web storage support.\nIf you're using Internet Explorer, you must load the page from a server for local storage to work.";
  }

  // hides open HTML Element
  var openDocument = document.getElementById("openDocument");
  openDocument.style.visibility = "hidden";
  // hides remove HTML Element
  var removeDocument = document.getElementById("removeDocument");
  removeDocument.style.visibility = "hidden";
  var activityMarkerStrokeWidth = 1.5;
  var activityNodeWidth = 120;
  var activityNodeHeight = 80;
  var defaultStrokeWidth = 1
  var defaultStrokeWidthIsCall = 4;

  var subprocessNodeFill = defaultNodeFill;

  var eventNodeSize = 60;
  var eventNodeInnerSize = eventNodeSize - 6;
  var eventNodeSymbolSize = eventNodeInnerSize - 14;
  var EventEndOuterFillColor = "pink";
  var EventBackgroundColor = gradLightGreen;
  var EventSymbolLightFill = "white";
  var EventSymbolDarkFill = "dimgray";
  var eventNodeStrokeWidthIsEnd = 4;

  var gatewayNodeSize = 80;
  var gatewayNodeSymbolSize = 45;
  var gatewayNodeFill = gradYellow;
  var gatewayNodeSymbolFill = gradYellow;

  var dataFill = gradLightGray;

  window.myDiagram =
    _$(yy.Diagram, "myDiagram", {
      allowDrop: true, // accept drops from palette

      commandHandler: new DrawCommandHandler(), // defined in DrawCommandHandler.js
      // default to having arrow keys move selected nodes
      "commandHandler.arrowKeyBehavior": "move",
      mouseDrop: function (e) {
        // when the selection is dropped in the diagram's background,
        // make sure the selected Parts no longer belong to any Group
        var ok = myDiagram.commandHandler.addTopLevelParts(myDiagram.selection, true);
        if (!ok)
          myDiagram.currentTool.doCancel();
      },
      draggingTool: new GuidedDraggingTool(),  // defined in GuidedDraggingTool.js
      "draggingTool.horizontalGuidelineColor": "blue",
      "draggingTool.verticalGuidelineColor": "blue",
      "draggingTool.centerGuidelineColor": "green",
      "draggingTool.guidelineWidth": 1,
      "ExternalObjectsDropped": function (e) {
        document.getElementById("myDiagram").focus();  // assume keyboard focus should be on myDiagram
        myDiagram.toolManager.draggingTool.clearGuidelines();  // remove any guidelines
      },
//      linkingTool: new BPMNLinkingTool(),
      "linkingTool.linkValidation": sameLevel, // defined below
      "relinkingTool.linkValidation": sameLevel,
      // set these kinds of Diagram properties after initialization, not now
      "InitialLayoutCompleted": loadDiagramProperties, // defined below
      "LinkDrawn": maybeChangeLinkCategory,
      groupSelectionAdornmentTemplate: // this applies to all Groups
        _$(yy.Adornment, yy.Panel.Auto,
          _$(yy.Shape, "Rectangle", {
            fill: null,
            stroke: "dodgerblue",
            strokeWidth: 1
          }),
          _$(yy.Placeholder)),
      "commandHandler.archetypeGroupData": {
        isGroup: true,
        category: "OfNodes"
      }
    });
  myDiagram._actionMode = 'select';
  myDiagram.toolManager.draggingTool.isGuidelineEnabled = true;
  myDiagram.toolManager.linkingTool.archetypeLabelNodeData = { category: "LinkLabel"};
  myDiagram.addDiagramListener("ChangedSelection",
    function (e) {
      var i = myDiagram.selection.iterator;
      var nodeData;
      do {
        i.next();
        nodeData = i.value && i.value.data;
      } while (!1);
      nodeData && (!i.value.getLinkDirection) && (putNodeProperty(nodeData), filterProperty(nodeData));
    });
  var actionModeRecorder = null;
  $('.palettel-wraper').hover(function () {
    actionModeRecorder = myDiagram._actionMode;
    myDiagram._actionMode = 'select';
  }, function () {
    myDiagram._actionMode = actionModeRecorder;
  });
  // Custom Figures for Shapes
  yy.Shape.defineFigureGenerator("Empty", function (shape, w, h) {
    return new yy.Geometry();
  });

  var annotationStr = "M 150,0L 0,0L 0,600L 150,600 M 800,0";
  var annotationGeo = yy.Geometry.parse(annotationStr);
  annotationGeo.normalize();
  yy.Shape.defineFigureGenerator("Annotation", function (shape, w, h) {
    var geo = annotationGeo.copy();
    // calculate how much to scale the Geometry so that it fits in w x h
    var bounds = geo.bounds;
    var scale = Math.min(w / bounds.width, h / bounds.height);
    geo.scale(scale, scale);
    return geo;
  });

  var gearStr = "F M 391,5L 419,14L 444.5,30.5L 451,120.5L 485.5,126L 522,141L 595,83L 618.5,92L 644,106.5" +
    "L 660.5,132L 670,158L 616,220L 640.5,265.5L 658.122,317.809L 753.122,322.809L 770.122,348.309L 774.622,374.309" +
    "L 769.5,402L 756.622,420.309L 659.122,428.809L 640.5,475L 616.5,519.5L 670,573.5L 663,600L 646,626.5" +
    "L 622,639L 595,645.5L 531.5,597.5L 493.192,613.462L 450,627.5L 444.5,718.5L 421.5,733L 393,740.5L 361.5,733.5" +
    "L 336.5,719L 330,627.5L 277.5,611.5L 227.5,584.167L 156.5,646L 124.5,641L 102,626.5L 82,602.5L 78.5,572.5" +
    "L 148.167,500.833L 133.5,466.833L 122,432.5L 26.5,421L 11,400.5L 5,373.5L 12,347.5L 26.5,324L 123.5,317.5" +
    "L 136.833,274.167L 154,241L 75.5,152.5L 85.5,128.5L 103,105.5L 128.5,88.5001L 154.872,82.4758L 237,155" +
    "L 280.5,132L 330,121L 336,30L 361,15L 391,5 Z M 398.201,232L 510.201,275L 556.201,385L 505.201,491L 399.201,537" +
    "L 284.201,489L 242.201,385L 282.201,273L 398.201,232 Z";
  var gearGeo = yy.Geometry.parse(gearStr);
  gearGeo.normalize();

  yy.Shape.defineFigureGenerator("BpmnTaskService", function (shape, w, h) {
    var geo = gearGeo.copy();
    // calculate how much to scale the Geometry so that it fits in w x h
    var bounds = geo.bounds;
    var scale = Math.min(w / bounds.width, h / bounds.height);
    geo.scale(scale, scale);
    // text should yy in the hand
    geo.spot1 = new yy.Spot(0, 0.6, 10, 0);
    geo.spot2 = new yy.Spot(1, 1);
    return geo;
  });

  var handGeo = yy.Geometry.parse("F1M18.13,10.06 C18.18,10.07 18.22,10.07 18.26,10.08 18.91," +
    "10.20 21.20,10.12 21.28,12.93 21.36,15.75 21.42,32.40 21.42,32.40 21.42," +
    "32.40 21.12,34.10 23.08,33.06 23.08,33.06 22.89,24.76 23.80,24.17 24.72," +
    "23.59 26.69,23.81 27.19,24.40 27.69,24.98 28.03,24.97 28.03,33.34 28.03," +
    "33.34 29.32,34.54 29.93,33.12 30.47,31.84 29.71,27.11 30.86,26.56 31.80," +
    "26.12 34.53,26.12 34.72,28.29 34.94,30.82 34.22,36.12 35.64,35.79 35.64," +
    "35.79 36.64,36.08 36.72,34.54 36.80,33.00 37.17,30.15 38.42,29.90 39.67," +
    "29.65 41.22,30.20 41.30,32.29 41.39,34.37 42.30,46.69 38.86,55.40 35.75," +
    "63.29 36.42,62.62 33.47,63.12 30.76,63.58 26.69,63.12 26.69,63.12 26.69," +
    "63.12 17.72,64.45 15.64,57.62 13.55,50.79 10.80,40.95 7.30,38.95 3.80," +
    "36.95 4.24,36.37 4.28,35.35 4.32,34.33 7.60,31.25 12.97,35.75 12.97," +
    "35.75 16.10,39.79 16.10,42.00 16.10,42.00 15.69,14.30 15.80,12.79 15.96," +
    "10.75 17.42,10.04 18.13,10.06z ");
  handGeo.rotate(90, 0, 0);
  handGeo.normalize();
  yy.Shape.defineFigureGenerator("BpmnTaskManual", function (shape, w, h) {
    var geo = handGeo.copy();
    // calculate how much to scale the Geometry so that it fits in w x h
    var bounds = geo.bounds;
    var scale = Math.min(w / bounds.width, h / bounds.height);
    geo.scale(scale, scale);
    // guess where text should yy (in the hand)
    geo.spot1 = new yy.Spot(0, 0.6, 10, 0);
    geo.spot2 = new yy.Spot(1, 1);
    return geo;
  });

  // sets the qualities of the tooltip
  var tooltiptemplate =
    _$(yy.Adornment, yy.Panel.Auto,
      _$(yy.Shape, "RoundedRectangle", {
        fill: "whitesmoke",
        stroke: "gray"
      }),
      _$(yy.TextBlock, {
          margin: 3,
          editable: true
        },
        new yy.Binding("text", "", function (data) {
          if (data.description) {
            return data.description;
          }
          return '';
        }))
    );

  function convertShapeType(s) {
    var shaps = [
      'Circle',
      'Ellipse',
      'Rectangle',
      'RoundedRectangle',
      'Triangle',
      'Diamond',
      'Pentagon',
      'Hexagon'
    ];
    if (typeof s === 'string') {
      return yy.Geometry.parse(s, false);
    }
    return shaps[s] || 'Rectangle';
  }

  function nodeActivityTaskTypeConverter(s) {
    var tasks = ["Empty",
      "BpmnTaskMessage",
      "BpmnTaskUser",
      "BpmnTaskManual", // Custom hand symbol
      "BpmnTaskScript",
      "BpmnTaskMessage", // should be black on white
      "BpmnTaskService", // Custom gear symbol
      "InternalStorage"
    ];
    if (s < tasks.length)
      return tasks[s];
    return "NotAllowed"; // error
  }

  // location of event on boundary of Activity is based on the index of the event in the boundaryEventArray
  function nodeActivityBESpotConverter(s) {
    var x = 10 + (eventNodeSize / 2);
    if (s === 0)
      return new yy.Spot(0, 1, x, 0); // bottom left
    if (s === 1)
      return new yy.Spot(1, 1, -x, 0); // bottom right
    if (s === 2)
      return new yy.Spot(1, 0, -x, 0); // top right
    return new yy.Spot(1, 0, -x - (s - 2) * eventNodeSize, 0); // top ... right-to-left-ish spread
  }

  function nodeActivityTaskTypeColorConverter(s) {
    return (s == 5) ? "dimgray" : "white";
  }

  function nodeEventTypeConverter(s) {
    var tasks = ["NotAllowed",
      "Empty",
      "BpmnTaskMessage",
      "BpmnEventTimer",
      "BpmnEventEscalation",
      "BpmnEventConditional",
      "Arrow",
      "BpmnEventError",
      "ThinX",
      "BpmnActivityCompensation",
      "Triangle",
      "Or",
      "ThickCross",
      "Circle"
    ];
    if (s < tasks.length)
      return tasks[s];
    return "NotAllowed"; // error
  }

  function nodeEventDimensionSymbolFillConverter(s) {
    return EventSymbolLightFill;
  }

  //------------------------------------------  Activity Node Boundary Events   ----------------------------------------------

  var boundaryEventMenu = // context menu for each boundaryEvent on Activity node
    _$(yy.Adornment, "Vertical",
      _$("ContextMenuButton",
        _$(yy.TextBlock, "Remove event"),
        // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
        {
          click: function (e, obj) {
            removeActivityNodeBoundaryEvent(obj.part.adornedObject);
          }
        })
    );

  // removing a boundary event doesn't not reposition other BE circles on the node
  // just reassigning alignmentIndex in remaining BE would do that.
  function removeActivityNodeBoundaryEvent(obj) {
    myDiagram.startTransaction("removeBoundaryEvent");
    var pid = obj.portId;
    var arr = obj.panel.itemArray;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].portId === pid) {
        myDiagram.model.removeArrayItem(arr, i);
        break;
      }
    }
    myDiagram.commitTransaction("removeBoundaryEvent");
  }

  var boundaryEventItemTemplate =
    _$(yy.Panel, "Spot", {
        contextMenu: boundaryEventMenu,
        alignmentFocus: yy.Spot.Center,
        fromLinkable: true,
        toLinkable: false,
        cursor: "pointer",
        fromSpot: yy.Spot.Bottom,
        fromMaxLinks: 1,
        toMaxLinks: 0
      },
      new yy.Binding("portId", "portId"),
      new yy.Binding("alignment", "alignmentIndex", nodeActivityBESpotConverter),
      _$(yy.Shape, "Circle", {
          desiredSize: new yy.Size(eventNodeSize, eventNodeSize)
        },
        new yy.Binding("fromSpot", "alignmentIndex",
          function (s) {
            //  nodeActivityBEFromSpotConverter, 0 & 1 yy on bottom, all others on top of activity
            if (s < 2)
              return yy.Spot.Bottom;
            return yy.Spot.Top;
          }),
        new yy.Binding("fill", "color")),
      _$(yy.Shape, "Circle", {
        alignment: yy.Spot.Center,
        desiredSize: new yy.Size(eventNodeInnerSize, eventNodeInnerSize),
        fill: null
      }),
      _$(yy.Shape, "NotAllowed", {
          alignment: yy.Spot.Center,
          desiredSize: new yy.Size(eventNodeSymbolSize, eventNodeSymbolSize),
          fill: "black"
        },
        new yy.Binding("figure", "eventType", nodeEventTypeConverter)
      )
    );

  //------------------------------------------  Activity Node contextMenu   ----------------------------------------------
  //YY_v
  var activityNodeMenu =
    _$(yy.Adornment, "Vertical",
      _$("ContextMenuButton",
        _$(yy.TextBlock, "Link Node", {
          margin: 3
        }), {
          click: function (e, obj) {
            var arg = [null, null, null, null],
              i = 0;
            var it = myDiagram.selection.iterator;
            var lt = myDiagram.toolManager.linkingTool;
            while (it.next()) {
              arg[i] = it.value;
              i += 2;
            }
            lt.insertLink.apply(lt, arg);
          }
        }),
      _$("ContextMenuButton",
        _$(yy.TextBlock, "Export Node Paths", {
          margin: 3
        }), {
          click: function (e, obj) {
            var pathServer = new PathServer(myDiagram.model.linkDataArray);
            var nodeKey = obj.Vi.Zl.key;
            var allPaths = {
              currentNodeKey: nodeKey,
              currentNodeAllPaths: pathServer.getAllPathsForKey(nodeKey)
            };
            var BB = Blob;
            saveAs(
              new BB(
                [JSON.stringify(allPaths, null, '  ')], {
                  type: "text/plain;charset=" + document.characterSet
                }
              ), 'Key:' + nodeKey + "Paths.txt"
            );
          }
        }),
      _$("ContextMenuButton",
        _$(yy.TextBlock, "Select Node Paths", {
          margin: 3
        }), {
          click: function (e, obj) {
            var pathServer = new PathServer(myDiagram.model.linkDataArray);
            var nodeKey = obj.Vi.Zl.key;
            var allPaths = pathServer.getAllPathsForKey(nodeKey);
            var linksData = myDiagram.model.linkDataArray;
            for (var i = 0, len = allPaths.length, item; i < len; i++) {
              item = allPaths[i].split(',');
              item.forEach(function (e, i) {
                var currentNodeKey = Number(e);
                var anotherNodeKey = Number(item[i + 1]);
                myDiagram.findNodeForKey(currentNodeKey).ib = true;
                if (anotherNodeKey) {
                  linksData.forEach(function (e, i) {
                    if (e.from === currentNodeKey && e.to === anotherNodeKey || e.to === currentNodeKey && e.from === anotherNodeKey) {
                      myDiagram.findLinkForData(e).ib = true;
                    }
                  });
                }
              });
            }
          }
        }));

  // sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array
  function makeSubButton(sub) {
    if (sub)
      return [_$("SubGraphExpanderButton"),
        {
          name: "subExpandBtn",
          margin: 2,
          visible: false
        },
        new yy.Binding("visible", "isSubProcess")
      ];
    return [];
  }

  // sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array
  function makeMarkerPanel(sub, scale) {
    return _$(yy.Panel, "Horizontal", {
        alignment: yy.Spot.MiddleBottom,
        alignmentFocus: yy.Spot.MiddleBottom
      },
      _$(yy.Shape, "BpmnActivityLoop", {
          width: 12 / scale,
          height: 12 / scale,
          margin: 2,
          visible: false,
          strokeWidth: activityMarkerStrokeWidth
        },
        new yy.Binding("visible", "isLoop")),
      _$(yy.Shape, "BpmnActivityParallel", {
          width: 12 / scale,
          height: 12 / scale,
          margin: 2,
          visible: false,
          strokeWidth: activityMarkerStrokeWidth
        },
        new yy.Binding("visible", "isParallel")),
      _$(yy.Shape, "BpmnActivitySequential", {
          width: 12 / scale,
          height: 12 / scale,
          margin: 2,
          visible: false,
          strokeWidth: activityMarkerStrokeWidth
        },
        new yy.Binding("visible", "isSequential")),
      _$(yy.Shape, "BpmnActivityAdHoc", {
          width: 12 / scale,
          height: 12 / scale,
          margin: 2,
          visible: false,
          strokeWidth: activityMarkerStrokeWidth
        },
        new yy.Binding("visible", "isAdHoc")),
      _$(yy.Shape, "BpmnActivityCompensation", {
          width: 12 / scale,
          height: 12 / scale,
          margin: 2,
          visible: false,
          strokeWidth: activityMarkerStrokeWidth,
          fill: null
        },
        new yy.Binding("visible", "isCompensation")),
      makeSubButton(sub)
    ); // end activity markers horizontal panel
  }

  function TemplateFactory() {

  }

  function resetPropertyPanel() {
    if (!myDiagram.selection.i) {
      $("#shapeBackgroundColorPicker").getKendoColorPicker().value('white');
      $("#shapeStrokeColorPicker").getKendoColorPicker().value('white');
      $("#shapeStrokeWidth").getKendoNumericTextBox().value(0);
      $("#shapePositionX").getKendoNumericTextBox().value(0);
      $("#shapePositionY").getKendoNumericTextBox().value(0);
      $("#shapeWidth").getKendoNumericTextBox().value(0);
      $("#shapeHeight").getKendoNumericTextBox().value(0);
      $('#shapeTitle').parent().find('input').val('');
    }
  }

  // ---------------------------------------- template for Activity / Task node in Palette

  var palscale = 1;
  var activityNodeTemplateForPalette =
    _$(yy.Node, "Vertical", {
        locationObjectName: "SHAPE",
        locationSpot: yy.Spot.Center,
        selectionAdorned: false
      },
      _$(yy.Panel, "Spot",
        _$(yy.Shape,
          {
            name: "SHAPE",
            stroke: defaultStroke,
            width: 70,
            height: 70,
            parameter1: 10 / palscale // corner size (default 10)
          },
          new yy.Binding("fill", "color"),
          new yy.Binding("maxSize", "size", yy.Size.parse).makeTwoWay(yy.Size.stringify),
          new yy.Binding("geometry", "geometry", convertShapeType),
          new yy.Binding('stroke', 'strokeColor'),
          new yy.Binding("strokeWidth", "strokeWidth"),
          new yy.Binding('visible','imageURL',function(s){return s ? false : true;}),
          new yy.Binding("figure", "shapeType", convertShapeType),
          new yy.Binding("strokeDashArray", "busType", function (s) {
            return (s === 'AND' || s === 'OR') ? [4, 2] : null;
          })
        ),
        _$(yy.Picture, {
            name:'picture',
            source: "",
            margin:20,
            imageStretch: yy.GraphObject.Uniform,
            visible:false
          },
          new yy.Binding('source','imageURL'),
          new yy.Binding("desiredSize", "size", yy.Size.parse).makeTwoWay(yy.Size.stringify),
          new yy.Binding('visible','imageURL',function(s){return s ? true : false;})
        ),
        _$(yy.Shape, "NotAllowed", {
            alignment: yy.Spot.Center,
            stroke: "black",
            fill: '#ffffff',
            desiredSize: new yy.Size(eventNodeSymbolSize, eventNodeSymbolSize)
          },
          new yy.Binding("figure", "eventType", nodeEventTypeConverter),
          new yy.Binding("geometry", "subGeometry", convertShapeType),
          new yy.Binding("visible", "busType", function (s) {
            if (s === 'OR' || s === 'AND') {
              return !0;
            }
            return !1;
          })
        ),
        makeMarkerPanel(false, palscale) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
      ),
      _$(yy.TextBlock, // the center text
        {
          alignment: yy.Spot.Center,
          textAlign: "left",
          margin: 10
        }, new yy.Binding("text", "description"))
    ); // End Node

  var subProcessGroupTemplateForPalette =
    _$(yy.Group, "Vertical", {
        locationObjectName: "SHAPE",
        locationSpot: yy.Spot.Center,
        isSubGraphExpanded: false,
        selectionAdorned: false
      },
      _$(yy.Panel, "Auto", {
          name: "PANEL",
          width: 70,
          height: 60
        },
        _$(yy.Panel, "Spot",
          _$(yy.Shape, "RoundedRectangle", // the outside rounded rectangle
            {
              name: "SHAPE",
              fill: defaultNodeFill,
              stroke: defaultStroke,
              parameter1: 10 / palscale // corner size (default 10)
            },
            new yy.Binding('stroke', 'strokeColor'),
            new yy.Binding("strokeWidth", "strokeWidth")
          ),
          _$(yy.Panel, "Horizontal", {
              alignment: yy.Spot.MiddleBottom,
              alignmentFocus: yy.Spot.MiddleBottom
            },
            // add a fake subgraph button (so we can scale it)
            _$(yy.Panel, "Auto", {
                margin: 2,
                visible: false
              }, // don't have a plus with a box around it, so make one from 2 parts
              _$(yy.Shape, "Rectangle", {
                width: 12 / palscale,
                height: 12 / palscale,
                strokeWidth: activityMarkerStrokeWidth,
                fill: null
              }),
              _$(yy.Shape, "PlusLine", {
                width: 8 / palscale,
                height: 8 / palscale,
                strokeWidth: activityMarkerStrokeWidth
              }),
              new yy.Binding("visible", "isSubProcess")
            )
          ) // end activity markers horizontal panel
        )
      ), // end main body rectangles spot panel
      _$(yy.TextBlock, // the center text
        {
          alignment: yy.Spot.Center,
          textAlign: "center",
          margin: 10
        },
        new yy.Binding("text", "description").makeTwoWay())
    ); // end yy.Group

  //------------------------------------------  Event Node Template   ----------------------------------------------

  var eventNodeTemplate =
    _$(yy.Node, "Vertical", {
        locationObjectName: "SHAPE",
        locationSpot: yy.Spot.Center,
        toolTip: tooltiptemplate,
        resizable: true,
        resizeObjectName: "SHAPE",
//        doubleClick: function (e, node) {
//          myDiagram.commandHandler.editTextBlock();
//        },
        selectionChanged: resetPropertyPanel
      },
      new yy.Binding("location", "loc", yy.Point.parse).makeTwoWay(yy.Point.stringify),
      // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
      new yy.Binding("layerName", "isSelected", function (s) {
        return s ? "Foreground" : "";
      }).ofObject(),

      _$(yy.Panel, "Spot",
        _$(yy.Shape, "Circle", // Outer circle
          {
            strokeWidth: 1,
            stroke: defaultStroke,
            name: "SHAPE",
            desiredSize: new yy.Size(eventNodeSize, eventNodeSize),
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            width: 70,
            height: 70,
            cursor: "pointer"
          },
          new yy.Binding("fill", "color"),
          new yy.Binding('stroke', 'strokeColor'),
          new yy.Binding("strokeWidth", "strokeWidth"),
          new yy.Binding("strokeDashArray", "busType", function (s) {
            return (s === 'AND' || s === 'OR') ? [4, 2] : null;
          }),
          new yy.Binding("desiredSize", "size", yy.Size.parse).makeTwoWay(yy.Size.stringify)
        ), // end main shape
        _$(yy.Shape, "NotAllowed", {
            alignment: yy.Spot.Center,
            stroke: "black",
            fill: '#ffffff',
            desiredSize: new yy.Size(eventNodeSymbolSize, eventNodeSymbolSize)
          },
          new yy.Binding("figure", "eventType", nodeEventTypeConverter),
          new yy.Binding("geometry", "geometry", convertShapeType)
        ),
        _$(yy.TextBlock, {
          alignment: yy.Spot.Center,
          textAlign: "left",
          margin: 5,
          editable: true,
          width: 60,
          wrap: yy.TextBlock.None,
          overflow: yy.TextBlock.OverflowEllipsis
        }, new yy.Binding("text", "annotationContent"))
      ) // end Auto Panel

    ); // end yy.Node Vertical

  //------------------------------------------  Gateway Node Template   ----------------------------------------------

  function nodeGatewaySymbolTypeConverter(s) {
    var tasks = ["Empty",
      "ThinCross", // Parallel
      "Circle", // Inclusive
      "AsteriskLine", // Complex
      "ThinX", // Exclusive
      "BpmnTaskManual",
      "BpmnTaskUser",
      "BpmnTaskMessage"
    ]
    if (s < tasks.length)
      return tasks[s];
    return "NotAllowed"; // error
  }

  // tweak the size of some of the gateway icons
  function nodeGatewaySymbolSizeConverter(s) {
    var size = new yy.Size(gatewayNodeSymbolSize, gatewayNodeSymbolSize);
    if (s === 4) {
      size.width = size.width / 4 * 3;
      size.height = size.height / 4 * 3;
    }
    return size;
  }

  function nodePalGatewaySymbolSizeConverter(s) {
    var size = nodeGatewaySymbolSizeConverter(s);
    size.width = size.width / 2;
    size.height = size.height / 2;
    return size;
  }


  //--------------------------------------------------------------------------------------------------------------


  //--------------------------------------------------------------------------------------------------------------

  var subProcessGroupTemplate =
    _$(yy.Group, "Spot", {
        locationSpot: yy.Spot.Center,
        locationObjectName: "PH",
        //locationSpot: yy.Spot.Center,
        isSubGraphExpanded: false,
        layerName: '',
//        doubleClick: function (e, node) {
//          myDiagram.commandHandler.editTextBlock();
//        },
        mouseDrop: function (e, grp) {
          var ok = grp.addMembers(grp.diagram.selection, true);
          if (!ok)
            grp.diagram.currentTool.doCancel();
        },
        contextMenu: activityNodeMenu,
        itemTemplate: boundaryEventItemTemplate,
        selectionChanged: resetPropertyPanel
//        resizable:true,
//        resizeObjectName:'SHAPE'
      },
      new yy.Binding("itemArray", "boundaryEventArray"),
      new yy.Binding("location", "loc", yy.Point.parse).makeTwoWay(yy.Point.stringify),
      // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
      _$(yy.Panel, "Auto",
        _$(yy.Shape, "RoundedRectangle", {
            name: "SHAPE",
            fill: subprocessNodeFill,
            stroke: defaultStroke,
//            maxSize: new yy.Size(160, 110),
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer"
          },
          new yy.Binding('fill', 'color'),
//          new yy.Binding("minSize", "size", yy.Size.parse).makeTwoWay(yy.Size.stringify),
          new yy.Binding('stroke', 'strokeColor'),
          new yy.Binding("strokeWidth", "strokeWidth")
        ),
        _$(yy.Panel, "Vertical", {
            defaultAlignment: yy.Spot.Left
          },
          _$(yy.TextBlock, {
              alignment: yy.Spot.TopCenter,
              name: "TITLE",
              textAlign: "left",
              margin: 6,
              wrap: yy.TextBlock.WrapFit,
              editable: true,
              font: "bold 13px Helvetica, Arial, sans-serif",
              minSize: new yy.Size(100, NaN)
            },
            new yy.Binding("text", "annotationContent").makeTwoWay()),
          _$(yy.TextBlock,
            {
              alignment: yy.Spot.Top,
              editable: true,
              textAlign: "left",
              margin: 5,
              font: "12px sans-serif",
              wrap: yy.TextBlock.WrapFit,
              minSize: new yy.Size(100, NaN),
              visible: false
            },
            new yy.Binding("text", "description").makeTwoWay()),
          // create a placeholder to represent the area where the contents of the group are
          _$(yy.Placeholder, {
            padding: new yy.Margin(10, 10)
          }),
          makeMarkerPanel(true, 1) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
        ) // end Vertical Panel
      )
    ); // end Group
  // square off the default button

  function fixExpandBtn(panel, subgraphBtn) {
    var sgBtn = panel.findObject(subgraphBtn);
    var border = sgBtn.findObject("ButtonBorder");
    if (border instanceof yy.Shape) {
      border.figure = "Rectangle";
      border.spot1 = new yy.Spot(0, 0, 2, 2);
      border.spot2 = new yy.Spot(1, 1, -2, -2);
    }
  }

  fixExpandBtn(subProcessGroupTemplate, "subExpandBtn");

  var grouptemplmap = new yy.Map("string", yy.Group);
  var nodePanel = {
    background: "transparent",
    ungroupable: true,
    // highlight when dragging into the Group
    // mouseDragEnter: function(e, grp, prev) { highlightGroup(e, grp, true); },
    // mouseDragLeave: function(e, grp, next) { highlightGroup(e, grp, false); },
    computesBoundsAfterDrag: true
    // when the selection is dropped into a Group, add the selected Parts into that Group;
    // if it fails, cancel the tool, rolling back any changes
    // mouseDrop: finishDrop,
    // Groups containing Nodes lay out their members vertically
  };
  Object.defineProperty(nodePanel, 'layout', {
    get: function () {
      return _$(yy.GridLayout, {
        wrappingColumn: 1,
        alignment: yy.GridLayout.Position,
        cellSize: new yy.Size(1, 1),
        spacing: new yy.Size(4, 4)
      })
    }
  });

  var groupMenu =
    _$(yy.Adornment, "Vertical",
      _$("ContextMenuButton",
        _$(yy.TextBlock, "Convert to library", {
          margin: 3
        }), {
          click: function (e, obj) {
            var myPartsList = new yy.List();
            var members = obj.part.ob.memberParts;
            while (members.next()) {
              myPartsList.add(members.value);
            }
            var canvasImg = myDiagram.makeImage({
              parts: myPartsList
            });
            myPalette2.add(
              _$(yy.Part, "Vertical", {
                  resizable: true
                },
                _$(yy.Picture, {
                  desiredSize: new yy.Size(80, 80),
                  source: canvasImg.src
                })
              ));
          }
        }));
  grouptemplmap.add("subprocess", subProcessGroupTemplate);
  grouptemplmap.add("OfNodes",
    _$(yy.Group, "Spot", {
        resizable: true,
        ungroupable: true,
        contextMenu: groupMenu
      },
      _$(yy.Panel, yy.Panel.Vertical,
        _$(yy.Placeholder, {
            padding: 5,
            alignment: yy.Spot.TopLeft
          },
          new yy.Binding("background", "isHighlighted", function (h) {
            return h ? "red" : "transparent";
          }).ofObject())
      ), // end Vertical Panel
      _$(yy.Shape, "Rectangle", {
        isPanelMain: true,
        fill: null,
        stroke: null
      })
    ));
  myDiagram.groupTemplateMap = grouptemplmap;

  //------------------------------------------  Node Template Map   ----------------------------------------------
  function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink)
      return;
    node.ports.each(function (port) {
      port.stroke = (show ? "white" : null);
    });
  }

  function nodeStyle() {
    return [
      // The Node.location comes from the "loc" property of the node data,
      // converted by the Point.parse static method.
      // If the Node.location is changed, it updates the "loc" property of the node data,
      // converting back using the Point.stringify static method.
      new yy.Binding("location", "loc", yy.Point.parse).makeTwoWay(yy.Point.stringify), {
        // the Node.location is at the center of each node
        locationSpot: yy.Spot.Center,
        //isShadowed: true,
        //shadowColor: "#888",
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter: function (e, obj) {
          showPorts(obj.part, true);
        },
        mouseLeave: function (e, obj) {
          showPorts(obj.part, false);
        }
      }
    ];
  }

  var commentNodeTemplate = _$(yy.Node, "Vertical", nodeStyle(),
    _$(yy.TextBlock, {
        margin: 5,
        maxSize: new yy.Size(200, NaN),
        wrap: yy.TextBlock.WrapFit,
        textAlign: "left",
        editable: true,
        font: "bold 12pt Helvetica, Arial, sans-serif",
        stroke: '#454545',
        text: "Text"
      },
      new yy.Binding("stroke", "strokeColor"),
      new yy.Binding("font", "font"),
      new yy.Binding("background", "color"),
      new yy.Binding("textAlign", "align"),
      new yy.Binding("text", "annotationContent").makeTwoWay()),
    _$(yy.TextBlock,
      {
        alignment: yy.Spot.Center,
        textAlign: "left",
        margin: 10
      }, new yy.Binding("text", "description"))

    // no ports, because no links are allowed to connect with a comment
  );
  // create the nodeTemplateMap, holding main view node templates:
  var activityNodeTemplate = _$(yy.Node, "Auto", {
      toolTip: tooltiptemplate,// use a Binding on the Shape.stroke to show selection
      contextMenu: activityNodeMenu,
      isActionable: false,
//      doubleClick: function (e, node) {
//        myDiagram.commandHandler.editTextBlock();
//      },
      selectionChanged: resetPropertyPanel,
      resizable: true, resizeObjectName: 'picture'
    },
    new yy.Binding("location", "loc", yy.Point.parse).makeTwoWay(yy.Point.stringify),
    _$(yy.Shape, "RoundedRectangle",
      { name: "SHAPE",
        fill: defaultNodeFill,
        stroke: defaultStroke,
        parameter1: 5, // corner size
        portId: "",
        fromLinkable: true,
        toLinkable: true,
        visible:true,
        cursor: "pointer"},
      new yy.Binding("figure", "shapeType", convertShapeType),
      new yy.Binding("geometry", "geometry", convertShapeType),
      new yy.Binding("fill", "color"),
      new yy.Binding("desiredSize", "size", yy.Size.parse).makeTwoWay(yy.Size.stringify),
      new yy.Binding('stroke', 'strokeColor'),
      new yy.Binding("strokeDashArray", "busType", function (s) {
        return (s === 'AND' || s === 'OR') ? [4, 2] : null;
      }),
      new yy.Binding("strokeWidth", "strokeWidth"),
      new yy.Binding('visible','imageURL',function(s){return s ? false : true;})
    ),
    _$(yy.Picture, {
      name:'picture',
      source: "",
      portId: "x",
      fromLinkable: true,
      toLinkable: true,
      imageStretch: yy.GraphObject.Uniform,
      visible:false
    },
    new yy.Binding('source','imageURL'),
    new yy.Binding("desiredSize", "size", yy.Size.parse).makeTwoWay(yy.Size.stringify),
    new yy.Binding('visible','imageURL',function(s){return s ? true : false;})
    ),
    _$(yy.Panel, "Vertical", {defaultAlignment: yy.Spot.TopCenter},
      _$(yy.TextBlock, {
          alignment: yy.Spot.TopCenter,
          name: "TITLE",
          textAlign: "left",
          margin: 6,
          wrap: yy.TextBlock.WrapFit,
          editable: true,
          font: "bold 13px Helvetica, Arial, sans-serif"
        },
        new yy.Binding("desiredSize", "size", function (s) {
          return yy.Size.parse((Number(s.split(' ')[0]) - 10) + ' NaN');
        }),
        new yy.Binding("visible", "busType", function (s) {
          if (s === 'OR' || s === 'AND') {
            return !1;
          }
          return !0;
        }),
        new yy.Binding("text", "annotationContent").makeTwoWay()),
      _$(yy.Shape, "NotAllowed", {
          alignment: yy.Spot.Center,
          stroke: "black",
          fill: '#ffffff',
          desiredSize: new yy.Size(eventNodeSymbolSize, eventNodeSymbolSize)
        },
        new yy.Binding("figure", "eventType", nodeEventTypeConverter),
        new yy.Binding("geometry", "subGeometry", convertShapeType),
        new yy.Binding("visible", "busType", function (s) {
          if (s === 'OR' || s === 'AND') {
            return !0;
          }
          return !1;
        })
      )
    )
  );
  var templmap = new yy.Map("string", yy.Node);
  // for each of the node categories, specify which template to use
  templmap.add("activity", activityNodeTemplate);
  templmap.add("event", eventNodeTemplate);

  // for the default category, "", use the same template that Diagrams use by default
  // this just shows the key value as a simple TextBlock
  templmap.add("", myDiagram.nodeTemplate);
  templmap.add("Comment", commentNodeTemplate);
  templmap.add("LinkLabel",
    _$("Node",
      { selectable: false, avoidable: false,
        layerName: "Foreground" },  // always have link label nodes in front of Links
      _$("Shape", "Ellipse",
        { width: 1, height: 1, stroke: null,fill:'#ccc',
          portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" })
    ));

  myDiagram.nodeTemplateMap = templmap;
  //YY;
  // create the nodeTemplateMap, holding special palette "mini" node templates:
  var palTemplateMap = new yy.Map("string", yy.Node);
  palTemplateMap.add("activity", activityNodeTemplateForPalette);
  palTemplateMap.add("event", eventNodeTemplate);
  palTemplateMap.add("Comment", commentNodeTemplate);
  var palGroupTemplateMap = new yy.Map("string", yy.Group);
  palGroupTemplateMap.add("subprocess", subProcessGroupTemplateForPalette);

  //------------------------------------------  Link Templates   ----------------------------------------------
  function maybeChangeLinkCategory(e) {
    var link = e.subject;
//    link.fromNode.isLinkLabel || link.toNode.isLinkLabel

  }

  var sequenceLinkTemplate =
    _$(yy.Link, {
        contextMenu: _$(yy.Adornment, "Vertical",
          _$("ContextMenuButton",
            _$(yy.TextBlock, "Default Flow"),
            // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
            {
              click: function (e, obj) {
                setSequenceLinkDefaultFlow(obj.part.adornedObject);
              }
            }),
          _$("ContextMenuButton",
            _$(yy.TextBlock, "Conditional Flow"),
            // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
            {
              click: function (e, obj) {
                setSequenceLinkConditionalFlow(obj.part.adornedObject);
              }
            })
        ),
        routing: yy.Link.AvoidsNodes,
        curve: yy.Link.JumpOver,
        corner: 5,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
        toEndSegmentLength: 3
      },
      new yy.Binding("points").makeTwoWay(),
      _$(yy.Shape, {
        isPanelMain: true,
        stroke: "#ccc",
        strokeWidth: 1
      }),
      _$(yy.Shape, {
        toArrow: '',//"Triangle",
        scale: 1.2,
        fill: "#ccc",
        stroke: null
      }),
      _$(yy.Shape, {
          fromArrow: "",
          scale: 1.5,
          stroke: "#ccc",
          fill: "white"
        },
        new yy.Binding("fromArrow", "isDefault", function (s) {
          if (s === null)
            return "";
          return s ? "BackSlash" : "StretchedDiamond";
        }),
        new yy.Binding("segmentOffset", "isDefault", function (s) {
          return s ? new yy.Point(15, 0) : new yy.Point(0, 0);
        })),
      _$(yy.TextBlock, { // this is a Link label
          name: "Label",
          editable: true,
          text: " ",
          segmentOffset: new yy.Point(-10, -10),
          visible: true,
          minSize: new yy.Size(30, 20),
          background: null, portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
        },
        new yy.Binding("text", "linkText").makeTwoWay(),
        new yy.Binding("visible", "visible").makeTwoWay())
    );

  // set Default Sequence Flow (backslash From Arrow)
  function setSequenceLinkDefaultFlow(obj) {
    myDiagram.startTransaction("setSequenceLinkDefaultFlow");
    var model = myDiagram.model;
    model.setDataProperty(obj.data, "isDefault", true);
    // Set all other links from the fromNode to be isDefault=null
    obj.fromNode.findLinksOutOf().each(function (link) {
      if (link !== obj && link.data.isDefault) {
        model.setDataProperty(link.data, "isDefault", null);
      }
    });
    myDiagram.commitTransaction("setSequenceLinkDefaultFlow");
  }

  // set Conditional Sequence Flow (diamond From Arrow)
  function setSequenceLinkConditionalFlow(obj) {
    myDiagram.startTransaction("setSequenceLinkConditionalFlow");
    var model = myDiagram.model;
    model.setDataProperty(obj.data, "isDefault", false);
    myDiagram.commitTransaction("setSequenceLinkConditionalFlow");
  }

  var messageFlowLinkTemplate =
    _$(PoolLink,
      {
        routing: yy.Link.Orthogonal,
        curve: yy.Link.JumpGap,
        corner: 10,
        reshapable: true,
        relinkableTo: true,
        toEndSegmentLength: 20
      },
      new yy.Binding("points").makeTwoWay(),
      _$(yy.Shape, {
        isPanelMain: true,
        stroke: "black",
        strokeWidth: 1,
        strokeDashArray: [6, 2]
      }),
      _$(yy.Shape, {
        toArrow: "Triangle",
        scale: 1,
        fill: "white",
        stroke: "black"
      }),
      _$(yy.Shape, {
        fromArrow: "Circle",
        scale: 1,
        visible: true,
        stroke: "black",
        fill: "white"
      }),
      _$(yy.TextBlock, {
          editable: true,
          text: "label"
        }, // Link label
        new yy.Binding("text", "text").makeTwoWay())
    );

  var dataAssociationLinkTemplate =
    _$(yy.Link, {
        routing: yy.Link.AvoidsNodes,
        curve: yy.Link.JumpGap,
        corner: 10,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true
      },
      new yy.Binding("points").makeTwoWay(),
      _$(yy.Shape, {
        stroke: "black",
        strokeWidth: 1,
        strokeDashArray: [1, 3]
      }),
      _$(yy.Shape, {
        toArrow: "OpenTriangle",
        scale: 1,
        fill: null,
        stroke: "blue"
      })
    );

  var annotationAssociationLinkTemplate =
    _$(yy.Link, {
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
        toEndSegmentLength: 20,
        fromEndSegmentLength: 40
      },
      new yy.Binding("points").makeTwoWay(),
      _$(yy.Shape, {
        stroke: "black",
        strokeWidth: 1,
        strokeDashArray: [1, 3]
      }),
      _$(yy.Shape, {
        toArrow: "OpenTriangle",
        scale: 1,
        stroke: "black"
      })
    );

  // in BPMN, can't like across subprocess boundaries.
  function sameLevel(fromnode, fromport, tonode, toport) {
    return fromnode.containingGroup === tonode.containingGroup;
  }

  var linkTemplateMap = new yy.Map("string", yy.Link);
  linkTemplateMap.add("msg", messageFlowLinkTemplate);
  linkTemplateMap.add("annotation", annotationAssociationLinkTemplate);
  linkTemplateMap.add("data", dataAssociationLinkTemplate);
  linkTemplateMap.add("", sequenceLinkTemplate); // default

  myDiagram.linkTemplateMap = linkTemplateMap;

  //------------------------------------------  Diagram Listeners   ----------------------------------------------

  myDiagram.addDiagramListener("LinkDrawn", function (e) {
    if (e.subject.fromNode.category === "annotation") {
      e.subject.category = "annotation"; // annotation association
    }
  });

  myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
    // e.subject is the collection that was just dropped
    e.subject.each(function (part) {
      if (part instanceof yy.Node && part.data.item === "end") {
        part.moveTo(part.location.x + 350, part.location.y)
      }
    });
    myDiagram.commandHandler.expandSubGraph();
  });

  // change the title to indicate that the diagram has been modified
  myDiagram.addDiagramListener("Modified", function (e) {
    var currentFile = document.getElementById("currentFile");
    var idx = currentFile.textContent.indexOf("*");
    if (myDiagram.isModified) {
      if (idx < 0)
        currentFile.textContent = currentFile.textContent + "*";
    } else {
      if (idx >= 0)
        currentFile.textContent = currentFile.textContent.substr(0, idx);
    }
  });

  //------------------------------------------  Palette   ----------------------------------------------
  // default structures
  var myPalette1 =
    _$(yy.Palette, "myPalette1", {
      nodeTemplateMap: palTemplateMap,
      groupTemplateMap: palGroupTemplateMap,
      "contextMenuTool.isEnabled": false, // but disable context menus
      allowZoom: false,
      layout: _$(yy.GridLayout, {
        cellSize: new yy.Size(10, 10),
        wrappingColumn: 1,
        spacing: new yy.Size(10, 10)
      })
    }); // end Palette
  var nodeDataArrayForPalettel = [
    {
      key: 1,
      category: "activity",
      text: "",
      description: "Start",
      content: '',
      taskType: 0,
      shapeType: 1,
      size: '70 60',
      busType: "Output",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: gradLightGreen
    },
    {
      key: 2,
      category: "activity",
      text: "",
      description: "End",
      content: '',
      taskType: 0,
      shapeType: 1,
      size: '70 60',
      busType: "Output",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: gradLightRed
    },
    {
      key: 3,
      category: "activity",
      text: "",
      description: "System\nPrompt",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: defaultNodeFill
    },
    {
      key: 4,
      loc: "0 0",
      text: "",
      isGroup: true,
      isSubProcess: true,
      category: "subprocess",
      description: "Sub\nProcess",
      content: '',
      taskType: 0,
      busType: "SubProcess",
      size: "70 50",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: defaultNodeFill
    },
    {
      key: 5,
      category: "activity",
      eventType: 11,
      eventDimension: 1,
      text: "",
      shapeType: 0,
      description: "OR",
      content: '',
      busType: "OR",
      color: gradLightGreen,
      size: "70 70",
      strokeColor: 'green',
      strokeWidth: 1,
      subGeometry: 'M8.791,55.72V5.903h23.375c4.699,0,8.271,0.447,10.717,1.342c2.446,0.896,4.399,2.476,5.862,4.741  c1.462,2.266,2.194,4.769,2.194,7.51c0,3.534-1.211,6.513-3.633,8.937c-2.422,2.425-6.162,3.965-11.221,4.621  c1.847,0.839,3.249,1.666,4.208,2.481c2.037,1.767,3.968,3.976,5.79,6.626l9.171,13.559h-8.775l-6.977-10.364  c-2.038-2.99-3.717-5.278-5.035-6.864c-1.319-1.586-2.499-2.695-3.542-3.33c-1.043-0.634-2.104-1.076-3.183-1.325  c-0.792-0.158-2.086-0.238-3.884-0.238h-8.092V55.72H8.791z M15.767,27.889h14.997c3.188,0,5.683-0.312,7.48-0.935  s3.165-1.62,4.1-2.99c0.936-1.371,1.402-2.86,1.402-4.469c0-2.356-0.905-4.293-2.715-5.811c-1.811-1.517-4.67-2.276-8.577-2.276  H15.767V27.889z'
    },
    {
      key: 6,
      category: "activity",
      eventType: 12,
      eventDimension: 6,
      shapeType: 0,
      text: "",
      description: "AND",
      content: '',
      busType: "AND",
      color: gradLightGreen,
      size: "70 70",
      strokeColor: 'green',
      strokeWidth: 1
    },
    {
      key: 7,
      category: "activity",
      text: "",
      description: "Condition",
      content: '',
      taskType: 0,
      shapeType: 5,
      busType: "Output",
      size: "70 70",
      strokeColor: 'gold',
      strokeWidth: 1,
      color: gatewayNodeFill
    },
    {
      key: 8,
      category: "Comment",
      text: "Text",
      description: "",
      content: '',
      busType: "TEXT",
      size: "70 70",
      strokeColor: 'black',
      font: 'bold 23px Helvetica, Arial, sans-serif',
      align: 'center',
      color: 'transparent'
    },
    {
      key: 9,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/jpeg;base64,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bHQAAAAAAAAAAAAAAABCbGQgVW50RiNSbHQAAAAAAAAAAAAAAABSc2x0VW50RiNQeGxAWADEgAAAAAAAAAp2ZWN0b3JEYXRhYm9vbAEAAAAAUGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABgAxIAAQACAGADEgABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAHg4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAE4QklNBAIAAAAAAAQAAAAAOEJJTQQwAAAAAAACAQE4QklNBC0AAAAAAAYAAQAAAAI4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADPwAAAAYAAAAAAAAAAAAAAE8AAABkAAAABWcqaAeYmAAtADEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAGQAAABPAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpj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AEMAUwA2AAAAAQA4QklNBAYAAAAAAAcACAAAAAEBAP/hDdZodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE1LTExLTEwVDEwOjA4OjQzKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE1LTExLTEwVDEwOjA4OjQzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNS0xMS0xMFQxMDowODo0MyswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFRTNBREFGNzRGODdFNTExQTAyOEE0Mjc5NzFEMjZGQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFRDNBREFGNzRGODdFNTExQTAyOEE0Mjc5NzFEMjZGQSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkVEM0FEQUY3NEY4N0U1MTFBMDI4QTQyNzk3MUQyNkZBIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6RUQzQURBRjc0Rjg3RTUxMUEwMjhBNDI3OTcxRDI2RkEiIHN0RXZ0OndoZW49IjIwMTUtMTEtMTBUMTA6MDg6NDMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRTNBREFGNzRGODdFNTExQTAyOEE0Mjc5NzFEMjZGQSIgc3RFdnQ6d2hlbj0iMjAxNS0xMS0xMFQxMDowODo0MyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlu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'
    },
    {
      key: 10,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/png;base64,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'
    },
    {
      key: 11,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/png;base64,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'
    },
    {
      key: 12,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/png;base64,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'
    },
    {
      key: 13,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/jpeg;base64,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bHQAAAAAAAAAAAAAAABCbGQgVW50RiNSbHQAAAAAAAAAAAAAAABSc2x0VW50RiNQeGxAWADEgAAAAAAAAAp2ZWN0b3JEYXRhYm9vbAEAAAAAUGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABgAxIAAQACAGADEgABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAHg4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAE4QklNBAIAAAAAAAQAAAAAOEJJTQQwAAAAAAACAQE4QklNBC0AAAAAAAYAAQAAAAI4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADPwAAAAYAAAAAAAAAAAAAAE8AAABkAAAABWcqaAeYmAAtADEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAGQAAABPAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpj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AEMAUwA2AAAAAQA4QklNBAYAAAAAAAcACAAAAAEBAP/hDdZodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE1LTExLTEwVDEwOjA4OjQzKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE1LTExLTEwVDEwOjA4OjQzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNS0xMS0xMFQxMDowODo0MyswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFRTNBREFGNzRGODdFNTExQTAyOEE0Mjc5NzFEMjZGQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFRDNBREFGNzRGODdFNTExQTAyOEE0Mjc5NzFEMjZGQSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkVEM0FEQUY3NEY4N0U1MTFBMDI4QTQyNzk3MUQyNkZBIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6RUQzQURBRjc0Rjg3RTUxMUEwMjhBNDI3OTcxRDI2RkEiIHN0RXZ0OndoZW49IjIwMTUtMTEtMTBUMTA6MDg6NDMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRTNBREFGNzRGODdFNTExQTAyOEE0Mjc5NzFEMjZGQSIgc3RFdnQ6d2hlbj0iMjAxNS0xMS0xMFQxMDowODo0MyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlu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'
    },
    {
      key: 14,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/png;base64,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'
    },
    {
      key: 15,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/png;base64,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'
    },
    {
      key: 16,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/png;base64,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'
    },
    {
      key: 17,
      category: "activity",
      text: "",
      description: "",
      content: '',
      taskType: 0,
      shapeType: 3,
      busType: "Output",
      size: "70 60",
      strokeColor: defaultStroke,
      strokeWidth: 1,
      color: 'transparent',
      imageURL:'data:image/png;base64,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'
    }

  ];

  var level1 = _$(yy.GraphLinksModel, {
    nodeDataArray: nodeDataArrayForPalettel
  }); // end model

  myPalette1.model = level1;

  //------------------------------------------  Overview   ----------------------------------------------

  var myOverview =
    _$(yy.Overview, "myOverview", {
      observed: myDiagram,
      maxScale: 0.5,
      contentAlignment: yy.Spot.Center
    });
  // change color of viewport border in Overview
  myOverview.box.elt(0).stroke = "dodgerblue";

  // start with a blank canvas:
  // myDiagram.isModified = false;
  // newDocument();

  // start with a simple preset model:
  loadModel();
} // end init

// When copying a node, we need to copy the data that the node is bound to.
// This JavaScript object includes properties for the node as a whole, and
// four properties that are Arrays holding data for each port.
// Those arrays and port data objects need to be copied too.

function copyNodeData(data) {
  var copy = {};
  for (var name in data) {
    var val = data[name];
    if (typeof val !== 'undefined') {
      copy[name] = data[name];
    }
  }
  if (data.isGroup) {
    copy.isGroup = true;
  }
  if (data.category === "activity" || data.category === "subprocess") {
    copy.boundaryEventArray = copyBoundaryEventArray(data.boundaryEventArray);
  }
  // if you add data properties, you should copy them here too
  return copy;
}

function copyBoundaryEventArray(arr) {
  var copy = [];
  if (Array.isArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
      copy.push(copyBoundaryEventData(arr[i]));
    }
  }
  return copy;
}

function copyBoundaryEventData(data) {
  var copy = {};
  copy.portId = data.portId;
  copy.alignmentIndex = data.alignmentIndex;
  copy.eventType = data.eventType;
  copy.color = data.color;
  // if you add BoundaryEvent data properties, you should copy them here too
  return copy;
}

//------------------------------------------  Commands for this application  ----------------------------------------------

// Add a port to the specified side of the selected nodes.   name is beN  (be0, be1)
function addActivityNodeBoundaryEvent(evType) {
  myDiagram.startTransaction("addBoundaryEvent");
  myDiagram.selection.each(function (node) {
    // skip any selected Links
    if (!(node instanceof yy.Node))
      return;
    if (node.data.category === "activity" || node.data.category === "subprocess") {
      // compute the next available index number for the side
      var i = 0;
      var defaultPort = node.findPort("");
      while (node.findPort("be" + i.toString()) !== defaultPort)
        i++; // now this new port name is unique within the whole Node because of the side prefix
      var name = "be" + i.toString();
      // get the Array of port data to be modified
      var arr = node.data["boundaryEventArray"];
      if (arr) {
        // create a new port data object
        var newportdata = {
          portId: name,
          eventType: evType,
          color: "white",
          alignmentIndex: i
          // if you add port data properties here, you should copy them in copyPortData above
        };
        // and add it to the Array of port data
        myDiagram.model.insertArrayItem(arr, -1, newportdata);
      }
    }
  });
  myDiagram.commitTransaction("addBoundaryEvent");
}

// changes the description of the object
function rename(obj) {
  myDiagram.startTransaction("rename");
  var newName = prompt("Rename " + obj.part.data.description + " to:");
  myDiagram.model.setDataProperty(obj.part.data, "description", newName);
  myDiagram.commitTransaction("rename");
}

// shows/hides gridlines
// to be implemented onclick of a button
function updateGridOption() {
  myDiagram.startTransaction("grid");
  var grid = document.getElementById("grid");
  myDiagram.grid.visible = grid.checked;
  myDiagram.commitTransaction("grid");
}

// enables/disables snapping tools, to be implemented by buttons
function updateSnapOption() {
  // no transaction needed, because we are modifying tools for future use
  var snap = document.getElementById("snap");
  if (snap.checked) {
    myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;
    myDiagram.toolManager.resizingTool.isGridSnapEnabled = true;
  } else {
    myDiagram.toolManager.draggingTool.isGridSnapEnabled = false;
    myDiagram.toolManager.resizingTool.isGridSnapEnabled = false;
  }
}

// user specifies the amount of space between nodes when making rows and column
function askSpace() {
  var space = prompt("Desired space between nodes (in pixels):", "0");
  return space;
}

var UnsavedFileName = "(Unsaved File)";

function getCurrentFileName() {
  var currentFile = document.getElementById("currentFile");
  var name = currentFile.textContent;
  if (name[name.length - 1] === "*")
    return name.substr(0, name.length - 1);
  return name;
}

function setCurrentFileName(name) {
  var currentFile = document.getElementById("currentFile");
  if (myDiagram.isModified) {
    name += "*";
  }
  currentFile.textContent = name;
}

function newDocument() {
  $('#processId').val('');

  // checks to see if all changes have been saved
  if (myDiagram.isModified) {
    var save = confirm("Would you like to save changes to " + getCurrentFileName() + "?");
    if (save) {
      saveDocument();
    }
  }
  setCurrentFileName(UnsavedFileName);
  // loads an empty diagram
  myDiagram.model = new yy.GraphLinksModel();
  myDiagram.model.undoManager.isEnabled = true;
  myDiagram.isModified = false;
  ModelReset();
}

function ModelReset() {
  myDiagram.model.undoManager.isEnabled = true;
  myDiagram.model.linkFromPortIdProperty = "fromPort";
  myDiagram.model.linkToPortIdProperty = "toPort";
  myDiagram.model.linkLabelKeysProperty = "labelKeys";
  myDiagram.isModified = false;
  // Customize the node data copying function
  // to avoid sharing of port data arrays and of the port data themselves.
  // (Functions cannot be written/read in JSON format.)
  myDiagram.model.copyNodeDataFunction = copyNodeData;
}

function checkLocalStorage() {
  return (typeof(Storage) !== "undefined") && (window.localStorage !== undefined);
}

function saveToServer() {
  saveModel();
  $.ajax({
    url: '/blst/web/processController/updateProcessContent',
    type: 'post',
    data: {
      processId: Number($('#processId').val()),
      processContent: $('#mySavedModel').val()
    },
    success: function (data) {
      alert("Successful");
    },
    error: function (ex) {
      throw ex;
    }
  });
}

function downloadAsPicture() {
  var canvas = $("#myDiagram canvas")[0];
  canvas.toBlob(function (blob) {
    saveAs(
      blob,
      "diagram.png"
    );
  }, "image/png");
}

function loadFromJson() {
  var myWindow = $('#loadFromJson');
  if (!myWindow.data("kendoWindow")) {
    myWindow.kendoWindow({
      width: "400px",
      title: "Upload json file",
      actions: [
        "Pin",
        "Minimize",
        "Maximize",
        "Close"
      ]
    });
  }
  myWindow.data("kendoWindow").open().center();
}

// saves the current floor plan to local storage
function saveDocument() {
  if (checkLocalStorage()) {
    var saveName = getCurrentFileName();
    if (saveName === UnsavedFileName) {
      saveDocumentAs();
    } else {
      saveDiagramProperties()
      window.localStorage.setItem(saveName, myDiagram.model.toJson());
      myDiagram.isModified = false;
    }
  }
  alert("Successful");
}

// saves floor plan to local storage with a new name
function saveDocumentAs() {
  if (checkLocalStorage()) {
    var saveName = prompt("Save file as...", getCurrentFileName());
    if (saveName && saveName !== UnsavedFileName) {
      setCurrentFileName(saveName);
      saveDiagramProperties()
      window.localStorage.setItem(saveName, myDiagram.model.toJson());
      myDiagram.isModified = false;
    }
  }
}

// checks to see if all changes have been saved -> shows the open HTML element
function openDocument() {
  if (checkLocalStorage()) {
    if (myDiagram.isModified) {
      var save = confirm("Would you like to save changes to " + getCurrentFileName() + "?");
      if (save) {
        saveDocument();
      }
    }
    var myWindow = $('#openDocument');
    if (!myWindow.data("kendoWindow")) {
      myWindow.kendoWindow({
        width: "400px",
        title: "Open file",
        actions: [
          "Pin",
          "Minimize",
          "Maximize",
          "Close"
        ]
      });
    }
    myWindow.data("kendoWindow").open().center();
    updateFileList("mySavedFiles");
  }
}

// shows the remove HTML element
function removeDocument() {
  if (checkLocalStorage()) {
    openElement("removeDocument", "mySavedFiles2");
  }
}

// these functions are called when panel buttons are clicked

function loadFile() {
  var listbox = document.getElementById("mySavedFiles");
  // get selected filename
  var fileName = undefined;
  for (var i = 0; i < listbox.options.length; i++) {
    if (listbox.options[i].selected)
      fileName = listbox.options[i].text; // selected file
  }
  if (fileName !== undefined) {
    // changes the text of "currentFile" to be the same as the floor plan now loaded
    setCurrentFileName(fileName);
    // actually load the model from the JSON format string
    var savedFile = window.localStorage.getItem(fileName);
    myDiagram.model = yy.Model.fromJson(savedFile);
    myDiagram.model.undoManager.isEnabled = true;
    myDiagram.isModified = false;
    // eventually loadDiagramProperties will be called to finish
    // restoring shared saved model/diagram properties
  }
  closeElement("openDocument");
}

// Store shared model state in the Model.modelData property
function saveDiagramProperties() {
  myDiagram.model.modelData.position = yy.Point.stringify(myDiagram.position);
}

// NOT directly by loadFile.
function loadDiagramProperties(e) {
  var pos = myDiagram.model.modelData.position;
  if (pos)
    myDiagram.position = yy.Point.parse(pos);
}

// deletes the selected file from local storage
function removeFile() {
  var listbox = document.getElementById("mySavedFiles2");
  // get selected filename
  var fileName = undefined;
  for (var i = 0; i < listbox.options.length; i++) {
    if (listbox.options[i].selected)
      fileName = listbox.options[i].text; // selected file
  }
  if (fileName !== undefined) {
    // removes file from local storage
    window.localStorage.removeItem(fileName);
    // the current document remains open, even if its storage was deleted
  }
  closeElement("removeDocument");
}

function updateFileList(id) {
  // displays cached floor plan files in the listboxes
  var listbox = document.getElementById(id);
  // remove any old listing of files
  var last;
  while (last = listbox.lastChild)
    listbox.removeChild(last);
  // now add all saved files to the listbox
  for (var key in window.localStorage) {
    var storedFile = window.localStorage.getItem(key);
    if (!storedFile)
      continue;
    var option = document.createElement("option");
    option.value = key;
    option.text = key;
    listbox.add(option, null);
  }
}

function openElement(id, listid) {
  var panel = document.getElementById(id);
  if (panel.style.visibility === "hidden") {
    updateFileList(listid);
    panel.style.visibility = "visible";
  }
}

// hides the open/remove elements when the "cancel" button is pressed
function closeElement(id) {
  $('#' + id).parent().hide();
}

function downloadAsJson() {
  var get_blob = function () {
    return window.Blob;
  }
  var BB = get_blob();
  var str = myDiagram.model.toJson();
  saveAs(
    new BB(
      [str], {
        type: "text/plain;charset=" + document.characterSet
      }
    ), "data.txt"
  );
}

// save a model to and load a model from Json text, displayed below the Diagram
function saveModel() {
  var str = myDiagram.model.toJson();
  document.getElementById("mySavedModel").value = str;
}
function convertRecord(record) {
  var nodeDataArray = record.nodeDataArray;
  var paramRequired = [
    {name: 'busType', defaultVal: 'Output'},
    {name: 'color', defaultVal: defaultNodeFill},
    {name: 'strokeColor', defaultVal: defaultStroke},
    {name: 'strokeWidth', defaultVal: 1},
    {name: 'size', defaultVal: '70 70'},
    {name: 'description', defaultVal: ''},
    {name: 'content', defaultVal: ""}
  ];
  if (nodeDataArray) {
    nodeDataArray.forEach(function (e) {
      var busType;
      for (var i = 0, d; i < paramRequired.length; i++) {
        d = paramRequired[i];
        if (typeof e[d.name] === 'undefined') {
          e[d.name] = d.defaultVal;
          if (e.category === 'activity' && d.name === 'size') {
            d.defaultVal = '100 70';
          }
        }
        if (e.busType === 'SOI' || e.annotationContent === 'Start') {
          e.color = gradLightGreen;
        }
        if (e.busType === 'EOI' || e.annotationContent === 'End') {
          e.color = gradLightRed;
        }
      }
    });
  }
}
function updateModel(str) {
  if (str !== "") {
    var record = yy.Model.fromJson(str);
    convertRecord(record);
    myDiagram.model = record;
    // moving and linking Nodes, and deletions, can be undone with ctrl-z
    myDiagram.undoManager.isEnabled = true;
    ModelReset();
  }
}
function loadModel(str) {
  var jsonString = $('#mySavedModel').val();
  if (str) {
    updateModel(str);
    return;
  }
  $.ajax({
    url: 'getProcessForJSON',
    data: {
      processId: Number($('#processId').val())
    },
    type: 'get',
    dataType: 'text',
    success: function (str) {
      if (str == "EMPTY") {
        str = loadStaticMode();
      }
      updateModel(str);
    },
    error: function (ex) {
      var str = jsonString;
      updateModel(str);
    }
  });
}

function loadStaticMode() {
  $.ajax({
    url: 'process-data.json',
    type: 'get',
    dataType: 'text',
    success: function (data) {
      if (data !== "") {
        return data;
      }
    },
    eror: function (ex) {
      throw ex;
    }
  });
}

function PathServer(linkData) {
  var path = [];
  var me = this;
  this.linkData = linkData;
  this.previousPaths = [];
  this.nextPaths = [];
  this.findSblingNodeKey = findSblingNodeKey;
  this.getAllPathsForKey = getAllPathsForKey;
  this.findSblingPaths = findSblingPaths;

  function findSblingNodeKey(key, linkData, type) {
    var arr = [];
    var k1, k2;
    type === 'next' && (k1 = 'from', k2 = 'to');
    type === 'pre' && (k1 = 'to', k2 = 'from');
    for (var i = 0, len = me.linkData.length, item, index; i < len; i++) {
      item = linkData[i];
      if (item[k1] === key) {
        arr.push(item[k2]);
      }
    }
    return arr;
  }

  function findSblingPaths(key, linkData, type) {
    try {
      path.push(key);
      var previous = findSblingNodeKey(key, linkData, type);
      if (previous && previous.length === 0) {
        (type === 'pre' ? me.previousPaths : me.nextPaths).push(path.join(','));
      }
      for (var i = 0, len = previous.length, item; i < len; i++) {
        item = previous[i];
        findSblingPaths(item, linkData, type);
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      path.pop();
    }
  }

  function contactLinks(preLinks, nextLinks) {
    var array = [];
    for (var i = 0, len1 = preLinks.length, item1, arr1 = [], m; i < len1; i++) {
      item1 = preLinks[i].split(',');
      m = item1.length;
      while (--m) {
        arr1.push(item1[m]);
      }
      item1 = arr1.join(',') + ',';
      for (var n = 0, len2 = nextLinks.length, item2; n < len2; n++) {
        item2 = nextLinks[n];
        array.push(item1 + item2);
      }
      arr1 = [], item1 = null;
    }
    return array;
  }

  function getAllPathsForKey(key) {
    findSblingPaths(key, me.linkData, 'pre');
    findSblingPaths(key, me.linkData, 'next');
    return contactLinks(me.previousPaths, me.nextPaths);
  }
}

function changeNodeProperty(event) {
  var targetElement = $(event.target);
  var inputVal = targetElement.val();
  var inputName = targetElement.attr('name');
  var nodeKey;
  var nodeData = myDiagram.model.nodeDataArray;

  function getNodeData() {
    for (var i = 0; i < nodeData.length; i++) {
      var item = nodeData[i];
      if (item.key === Number(nodeKey)) {
        return item;
      }
    }
  }

  nodeKey = $('input[name=key]').val();
  myDiagram.model.startTransaction('changeProperty');
  myDiagram.model.setDataProperty(getNodeData(), inputName, inputVal);
  myDiagram.model.commitTransaction('changeProperty');
};

var filterProperty = function (nodeData) {
  var map = {
    Comment: 'font',
    activity: 'shape',
    event: 'shape',
    gateway: 'shape',
    subprocess: 'shape'
  };
  var type = nodeData.category;
  $('#shapeProperties li').hide();
  $('#shapeProperties li').each(function (i, e) {
    var c = $(e).attr('data-category');
    if (c === 'common' || c === map[type]) {
      $(e).show();
    }
  });

};

var putNodeProperty = function (data, keys) {
  var defaultKeys = [
    'key',
    'shapeTitle',
    'category',
    'description',
    'shapePositionX',
    'shapePositionY',
    'shapeStrokeColorPicker' ,
    'shapeStrokeWidth',
    'shapeWidth',
    'shapeHeight',
    'shapeBackgroundColorPicker',
    'fontSize',
    'textAlign',
    'ProContent',
    'shapeBackgroundImagePicker'
  ];
  var $inputWraper = jQuery('#configurationPanelBar');
  var k = keys || defaultKeys;
  for (var i = 0, len = k.length, item; i < len; i++) {
    item = k[i];
    var d = data[item];
    var e = $inputWraper.find('[id=' + item + ']');
    switch (i) {
      case 4:
        d = data['loc'] ? data['loc'].split(' ')[0] : 0;
        break;
      case 5:
        d = data['loc'] ? data['loc'].split(' ')[1] : 0;
        break;
      case 8:
        d = data['size'] ? data['size'].split(' ')[0] : 0;
        break;
      case 9:
        d = data['size'] ? data['size'].split(' ')[1] : 0;
        break;
      case 1:
        d = data['annotationContent'] || '';
        break;
      case 6:
        d = data['strokeColor'];
        e.parent().find('.k-selected-color').css('backgroundColor', d);
        break;
      case 7:
        d = data['strokeWidth'];
        break;
      case 10:
        d = data['color'].toLocaleString();
        if (/^Brush/.test(d)) {
          var reg = /\s0:(.*?)\s1:|\s1:(.*?)\s$/g;
          var match = reg.exec(d);
          while (match !== null) {
            d = match[1];
            match = reg.exec(d);
          }
        }
        e.parent().find('.k-selected-color').css('backgroundColor', d);
        break;
      case 11:
        d = data['font'] ? parseInt(data['font'].split(' ')[1], 10) : 0;
        break;
      case 13:
        var contentString = data['content'];
        try {
          d = JSON.parse(contentString);
        } catch (ex) {
          d = [];
        }
        var textareaContent = [];
        for (var m = 0, len = d.length, sentence; m < len; m++) {
          sentence = d[m];
          textareaContent.push(sentence.text + '\n');
        }
        break;
    }
    if (i === 1 || i === 4 || i === 5 || i === 7 || i === 8 || i === 9 || i === 11) {
      e.parent().find('input').val(d);
      continue;
    }
    if (i === 13) {
      contentEditor.viewModel.listeners.onRefresh(d);
      e[0].value = textareaContent.join('');
      continue;
    }
    e.val(d);
  }
};

function findGroupForNode(node, nodeDataArray, myDiagram) {
  var data = node.data;
  var node = null;
  var groupName = "OfNodes";
  if (data.group) {
    nodeDataArray.forEach(function (v, i) {
      v.isGroup && v.key === data.group && (node = myDiagram.findNodeForData(v))
      return false
    });
  }
  return node;
}

function changeSelectionColor(color, myDiagram) {
  var i = myDiagram.selection.iterator;
  var d;
  var nodeData = myDiagram.model.nodeDataArray;
  var _$ = yy.GraphObject.make;

  function convertColor(colorStr) {
    if (/^[0-9A-Fa-f]{3,6}/.test(colorStr)) {
      return '#' + colorStr;
    }
    return colorStr;
  }

  if ('[object Array]' === Object.prototype.toString.call(color)) {
    color = _$(yy.Brush, yy.Brush.Linear, {
      0: convertColor(color[0]),
      1: convertColor(color[1])
    })
  } else {
    color = convertColor(color);
  }
  while (i.next()) {
    d = i.value.data;
    nodeData.forEach(function (e, i) {
      if (e.key === d.key) {
        myDiagram.startTransaction('changeColor');
        myDiagram.model.setDataProperty(e, 'color', color);
        myDiagram.commitTransaction('changeColor');
      }
    });
  }
}
/**===========================This Page=======================================*/

(function () {
  var toolbarElement = {},
    parent = {},
    interval = 0,
    retryCount = 0,
    isRemoved = false;
  if (window.location.protocol === 'file:') {
    interval = window.setInterval(function () {
      toolbarElement = document.getElementById('coFrameDiv');
      if (toolbarElement) {
        parent = toolbarElement.parentNode;
        if (parent) {
          parent.removeChild(toolbarElement);
          isRemoved = true;
          if (document.body && document.body.style) {
            document.body.style.setProperty('margin-top', '0px', 'important');
          }
        }
      }
      retryCount += 1;
      if (retryCount > 10 || isRemoved) {
        window.clearInterval(interval);
      }
    }, 10);
  }
})();


$(function () {
  setMainCanvasHeight();
  init();
  $('.action-buttons').click(function (e) {
    var $target = $(e.target);
    $(this).find('button').removeClass('active');
    $target.addClass('active');
    if (/action-link/.test($target.attr('class'))) {
      myDiagram._actionMode = 'link';
    }
    if (/action-select/.test($target.attr('class'))) {
      myDiagram._actionMode = 'select';
    }
    if (/action-move/.test($target.attr('class'))) {
      myDiagram._actionMode = 'move';
    }
    if (/zoom-value\b/.test($target.attr('class'))) {
      var val = +($target.val()) / 100;
      myDiagram.scale = val;
      e.preventDefault();
      return false;
    }
    if (/action-zoomin/.test($target.attr('class'))) {
      myDiagram.Ze.increaseZoom();
    }
    if (/action-zoomout/.test($target.attr('class'))) {
      myDiagram.Ze.decreaseZoom();
    }
    if (/action-grid/.test($target.attr('class'))) {
      $('input#grid').click();
      updateGridOption()
    }
  });

  $('body').keydown(function (e) {
    var target = e.target;
    var isFocusInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    switch (!isFocusInput && e.keyCode) {
      case 67:
        myDiagram._actionMode = 'link';
        $('button.action-link').addClass('active');
        break;
    }
  });
  $('body').keyup(function (e) {
    var target = e.target;
    var isFocusInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    switch (!isFocusInput && e.keyCode) {
      case 67:
        myDiagram._actionMode = 'select';
        $('button.action-link').removeClass('active');
        break;
      case 86:
        $('button.action-select').click();
        break;
      case 72:
        $('button.action-move').click();
        break;
      default:
        return false;
        break;
    }
  });
  $('#myDiagram')[0].ondblclick = function (e) {
    myDiagram.selection.iterator.count && myDiagram.commandHandler.editTextBlock();
  };
  $('body').click(function (e) {
    var target = $(e.target);
    var editorPanel = $('#editorPanel');
    if (isDeactiveContentEditor()) {
      contentEditor.listeners.onDeactive.apply(contentEditor, null);
    }
    function isDeactiveContentEditor() {
      return editorPanel.length && editorPanel.is(':visible') && target.attr('id') !== 'ProContent' && !target.hasClass('k-button') && !$.isContainIn(target, '#editorPanel');
    };

  });

  $('.propertyPanel input').keyup(function (e) {
    _t && clearTimeout(_t);
    var _t = setTimeout(function () {
      changeNodeProperty(e);
    }, 500);
  });
  $('.colorPanel input').keyup(function (e) {
    _t && clearTimeout(_t);
    var _t = setTimeout(function () {
      var target = $(e.target);
      var val = target.val();
      if (target.parent().parent().attr('class') === 'gradient-color') {
        var c1 = $('.color-gradient1').val() || 'ccc';
        var c2 = $('.color-gradient2').val() || 'ccc';
        val = [c1, c2];
        $('.gradient-bar').attr('style', 'background: -webkit-linear-gradient(left, #' + c1 + ', #' + c2 + ');-moz-linear-gradient(left, #' + c1 + ', #' + c2 + ');linear-gradient(top, #' + c1 + ', #' + c2 + ');');
      }
      changeSelectionColor(val, myDiagram);
    }, 500);
  });
  $('.tab-trigger').children().each(function (i, e) {
    $(this).click(function (event) {
      var c = $('.tab-content').children();
      c.hide();
      c.eq(i).show();
    });
  });

  $('#sideBar .slide-trigger').click(function (e) {
    var next = $(this).next();
    $('.slide-wrapper').each(function (i, e) {
      if (e === next[0]) {
        $(e).show();
      } else {
        $(e).hide();
      }
      $(e).css({
        position: 'relative',
        zIndex: 999
      });
    });
  });

//  $('#myPalette1').add('#myPalette2').css('top', '10px');
$('#myPalette1').css('left','43px');
  var customEditor = $('<textarea id="customTextEditor" style="width: 300px; min-height: 100px; border: 1px solid black; background-color:#fff; visibility: hidden;position:absolute; z-index:999;"> </textarea>')[0];
  $('body').append(customEditor);
  myDiagram.toolManager.textEditingTool.defaultTextEditor = customEditor;
  customEditor.onActivate = function (textBlock) {
    var i = myDiagram.selection.iterator;
    i.next();
    var node = i.value;
    var title = node.findObject('TITLE');
    title && (customEditor.style.font = title.font);
    customEditor.value = customEditor.textEditingTool.textBlock.text;
    customEditor.style.visibility = "";
    // Do a few different things when a user presses a key
    customEditor.addEventListener("keydown", function (e) {
      var keynum = e.which;
      var tool = customEditor.textEditingTool;
      if (tool === null) return;
      if (keynum == 13 && e.ctrlKey === true) { // Accept on Enter
        tool.acceptText(yy.TextEditingTool.Tab);
        e.preventDefault();
        return false;
      } else if (keynum == 9) { // Accept on Tab
        tool.acceptText(yy.TextEditingTool.Tab);
        e.preventDefault();
        return false;
      } else if (keynum === 27) { // Cancel on Esc
        tool.doCancel();
        if (tool.diagram) tool.diagram.focus();
      }
    }, false);

    var loc = customEditor.textEditingTool.textBlock.getDocumentPoint(yy.Spot.TopLeft);
    var pos = myDiagram.transformDocToView(loc);
    customEditor.style.left = (pos.x - 45) + "px";
    customEditor.style.top = (pos.y - 35) + "px";
  };
  customEditor.onDeactivate = function (textBlock) {
    var oldTextBlockHeight = textBlock.actualBounds.size.height;
    var oldTextBlockWidth = textBlock.actualBounds.size.width;
    setTimeout(function () {
      try {
        var newTextBlockSize = (function () {
          var i = myDiagram.selection.iterator;
          i.next();
          return i.value.findObject('TITLE').actualBounds.size;
        })();
        var value = newTextBlockSize.height - oldTextBlockHeight;
        var value2 = newTextBlockSize.width - oldTextBlockWidth;
        var iterator = myDiagram.selection.iterator;
        iterator.next();
        var CurrentNode = iterator.value;
        while (!shapeObject) {
          try {
            var shapeObject = CurrentNode.findObject('SHAPE');
          } catch (ex) {
          }
        }
        var shapeOldHeight = shapeObject.height;
        var shapeOldWidth = shapeObject.width;
        shapeObject.height = shapeOldHeight + value + (shapeObject.figure === 'Diamond' || shapeObject.figure === 'Circle' ? newTextBlockSize.height * 21 / oldTextBlockHeight : 10);
        shapeObject.width = shapeObject.figure === 'Circle' ? shapeObject.height : (shapeOldWidth + value2 + (shapeObject.figure === 'Diamond' ? newTextBlockSize.height * 21 / oldTextBlockHeight : 10));
      } catch (ex) {
      }
    }, 700);
  };

  $('.alignTop').click(function () {
    myDiagram.commandHandler.alignTop();
  });
  $('.alignBottom').click(function () {
    myDiagram.commandHandler.alignBottom();
  });
  $('.alignLeft').click(function () {
    myDiagram.commandHandler.alignLeft();
  });
  $('.alignRight').click(function () {
    myDiagram.commandHandler.alignRight();
  });
  $('.alignHor').click(function () {
    myDiagram.commandHandler.alignCenterY();
  });
  $('.alignVer').click(function () {
    myDiagram.commandHandler.alignCenterX();
  });
  $('.toFront').click(function () {
    alert('TODO');
  });
  $('.toBack').click(function () {
    alert('TODO');
  });

  $('#uploadJson')[0].onchange = function () {
    var file = this.files[0];
    if (window.FileReader) {
      var fr = new FileReader();
      fr.onload = function (e) {
        var jsonString = e.target.result;
        updateModel(jsonString);
        $('#mySavedModel').val(jsonString);
        $('#loadFromJson').parent().hide();
      };
      fr.readAsText(file);
    }
  };
  $('#shapesPanelBar>li>span').click();
});

$(function () {
  var Shape = kendo.dataviz.diagram.Shape,
    Connection = kendo.dataviz.diagram.Connection,
    Rect = kendo.dataviz.diagram.Rect,
    Point = kendo.dataviz.diagram.Point,
    selected;

  function canvasPropertiesChange() {
    console.log("TODO");

  }

  $("#shapeProperties").on("change", shapePropertiesChange);

  function shapePropertiesChange(event) {
    if ($.isContainIn(event.target, '#editorPanel')) {
      return;
    }
    var targetElement = $(event.target);
    var inputVal = targetElement.val();
    var inputName = targetElement.attr('class').match(/fk-.*?(?=$|\s)/g)[0].replace('fk-', '');
    var getPropertyData = function (inputName, inputVal) {
      var map = {
        shapePositionX: 'loc',
        shapePositionY: 'loc',
        shapeTitle: 'annotationContent',
        shapeBackgroundColorPicker: 'color',
        shapeStrokeColorPicker: 'strokeColor',
        shapeStrokeWidth: 'strokeWidth',
        shapeWidth: 'size',
        shapeHeight: 'size',
        shapeDescription: 'description',
        fontSize: 'font',
        textAlign: 'align'
      };
      var exports = {
        dataKey: map[inputName] || inputName,
        dataValue: null
      };
      var i, n;
      exports.dataValue = inputVal;
      if (inputName === 'shapePositionX' && !void(i = 0, n = 0) || inputName === 'shapePositionY' && !void(i = 1, n = 0) || inputName === 'shapeWidth' && !void(i = 0, n = 1) || inputName === 'shapeHeight' && !void(i = 1, n = 1)) {
        var j = (n === 0 && 'loc') || (n === 1 && 'size');
        var v = itemNodeData[j].split(' ');
        v[i] = inputVal;
        exports.dataValue = v.join(' ');
      }
      if (inputName === 'shapeStrokeWidth') {
        exports.dataValue = parseInt(inputVal, 10);
      }
      if (inputName === 'fontSize') {
        var fontProperties = itemNodeData['font'].split(' ');
        fontProperties[1] = parseInt(inputVal, 10) + 'px';
        exports.dataValue = fontProperties.join(' ');
      }
      if (inputName === 'content') {
        exports.dataValue = JSON.stringify(contentEditor.viewModel.record);
      }
      return exports;
    };

    var nodeKey;
    var nodeData = myDiagram.model.nodeDataArray;

    function getNodeData() {
      for (var i = 0; i < nodeData.length; i++) {
        var item = nodeData[i];
        if (item.key === Number(nodeKey)) {
          return item;
        }
      }
    }

    nodeKey = Number($('input[id=key]').val());
    var itemNodeData = getNodeData();
    var resultData = getPropertyData(inputName, inputVal);
    myDiagram.model.startTransaction('changeProperty');
    myDiagram.model.setDataProperty(itemNodeData, resultData['dataKey'], resultData['dataValue']);
    myDiagram.model.commitTransaction('changeProperty');

  }

  function connectionPropertiesChange() {
    var elements = selected || [],
      options = {
        startCap: $("#connectionStartCap").getKendoDropDownList().value(),
        endCap: $("#connectionEndCap").getKendoDropDownList().value()
      },
      element;

    for (i = 0; i < elements.length; i++) {
      element = elements[i];
      if (element instanceof Connection) {
        element.redraw(options);
      }
    }
  }

  $("#connectionProperties").on("change", connectionPropertiesChange);

  $("#arrangeConfiguration .configurationButtons").kendoButton({
    click: function (e) {

    }
  });

  $("#diagramZoomIndicator").change(function (e) {
    var val = +(e.target.value) / 100;
    myDiagram.scale = val;
  });

  function undo() {
    myDiagram.commandHandler.undo();
  }

  function redo() {
    myDiagram.commandHandler.redo();
  }

  function copyItem() {
    myDiagram.commandHandler.copySelection();
  }

  function pasteItem() {
    myDiagram.commandHandler.pasteSelection();
  }

  function getStartNodeKey(nodeDataArray) {
    for (var i = 0, len = nodeDataArray.length, item; i < len; i++) {
      item = nodeDataArray[i];
      if (item.busType === 'SOI' || item.annotationContent === 'Start') {
        return item.key;
      }
    }
    return !1;
  }

  function listAllPaths() {
    var pathServer = new PathServer(myDiagram.model.linkDataArray);
    var nodeKey = getStartNodeKey(myDiagram.model.nodeDataArray);
    var myWindow = $('#listAllPaths');
    if (nodeKey) {
      var allPaths = pathServer.getAllPathsForKey(nodeKey);
      var allPathRecord = [];
//      var pathHtml = '';
      for (var i = 0, len = allPaths.length, currentPathKeys, str = ''; i < len; i++) {
        currentPathKeys = allPaths[i].split(',');
        var currentPathRecord = {
          pathID: 'Path' + (i + 1),
          nodeDataRecord: []
        };
        for (var n = 1, len2 = currentPathKeys.length, str2 = ''; n < len2; n++) {
          var nodeData = myDiagram.model.findNodeDataForKey(currentPathKeys[n]);
          currentPathRecord.nodeDataRecord.push(nodeData);
//          str2 += '<dd>' + nodeData.annotationContent + '</dd><dd>' + nodeData.description + '</dd>';
        }
        allPathRecord.push(currentPathRecord);
//        str += '<li><h3>' + currentPathRecord.pathID + ':</h3>' + '<dl>' + str2 + '</dl>';
      }
//      pathHtml += '<ul>' + str + '</ul>';
    }
    var sliderContentTemplate = [
      '<div class="csslider1 autoplay">',
      compileTemplate('    <input ngg-repeat="list" name="cs_anchor1" autocomplete="off" id="cs_slide1_{{$index}}" type="radio" class="cs_anchor slide">', allPathRecord),
      '    <input name="cs_anchor1" autocomplete="off" id="cs_play1" type="radio" class="cs_anchor" checked="">',
      '    <input name="cs_anchor1" autocomplete="off" id="cs_pause1" type="radio" class="cs_anchor">',
      '    <ul>',
      '        <div style="width: 100%; visibility: hidden; ">',
      '            {{getSliderContent(0)}}',
      '        </div>',
      compileTemplate(['<li ngg-repeat="list" class="num{{$index}} img">',
        '            {{getSliderContent($index)}}',
        '        </li>'].join(''), allPathRecord),
      '    </ul>',
      '    <div class="cs_description">',
      compileTemplate(['<label ngg-repeat="list" class="num{{$index}}">',
        '            <span class="cs_title"><span class="cs_wrapper">Path{{$index+1}}</span></span>',
        '        </label>'].join(), allPathRecord),
      '    </div>',
      '    <div class="cs_arrowprev">',
      compileTemplate('<label ngg-repeat="list" class="num{{$index}}" for="cs_slide1_{{$index}}"></label>', allPathRecord),
      '    </div>',
      '    <div class="cs_arrownext">',
      compileTemplate('<label ngg-repeat="list" class="num{{$index}}" for="cs_slide1_{{$index}}"></label>', allPathRecord),
      '    </div>',
      '    <div class="cs_bullets">',
      compileTemplate(['<label ngg-repeat="list" class="num{{$index}}" for="cs_slide1_{{$index}}">',
        '            <span class="cs_point"></span>',
        '            <span class="cs_thumb">{{nodeDataRecord.annotationContent}}</span>',
        '        </label>'].join(''), allPathRecord),
      '    </div>',
      '</div>'
    ].join('');

    function compileTemplate(template, data) {
      var str;
      if (/ngg-repeat/.test(template)) {
        var list = data;
        var _arr = [];
        template = template.replace(/\sngg-repeat=\"([^"]+)"/, '');
        for (var $index = 0, len = list.length, item, _str = ''; $index < len; $index++) {
          item = list[$index];
          _str = template.replace(/{{([^{}]+)}}/g, getStr('item'));
          _arr.push(_str);
        }
        return _arr.join('');
      }
      str = template.replace(/{{([^{}]+)}}/g, getStr('data'));
      function getStr(root) {
        return function (a, b, c) {
          if (/\(/.test(b) || /\$/.test(b)) {
            return eval(b);
          } else {
            return eval(root + '.' + b);
          }
        }
      }

      return str;
    }

    function getSliderContent(index) {
      var pathChatTemplate = {
        system: ['<div class="leftd">',
          '        <div class="leftimg"></div>',
          '        <div class="speech left" >{{annotationContent}}</div>',
          '    </div>'].join(''),
        user: ['<div class="rightd">',
          '        <div class="rightimg"></div>',
          '        <div class="speech right" >{{annotationContent}}</div>',
          '    </div>'].join('')};
      var data = allPathRecord[index];
      var header = '<h3>' + data.pathID + '</h3>';
      var textBody = '';
      for (var i = 0, item; i < data.nodeDataRecord.length; i++) {
        item = data.nodeDataRecord[i];
        if (item.shapeType === 1 || item.shapeType === 5) {
          textBody += compileTemplate(pathChatTemplate.system, item);
        } else {
          textBody += compileTemplate(pathChatTemplate.user, item);
        }
      }
      return header + textBody;
    }


    myWindow.html(compileTemplate(sliderContentTemplate, allPathRecord));
    if (!myWindow.data("kendoWindow")) {
      myWindow.kendoWindow({
        width: document.body.clientWidth - 10 + 'px',
        title: "List all paths",
        actions: [
          "Pin",
          "Minimize",
          "Maximize",
          "Close"
        ]
      });
    }
    myWindow.data("kendoWindow").open().center();
    myWindow.parent().css({top: '0px', height: document.body.clientHeight - 50 + 'px'});
    $('.csslider1').add('.csslider1 ul').add('.csslider1 li').css('height', document.body.clientHeight - 90 + 'px');
//    window.open ('path.html','Path','height=800,width=1000,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=no');
  }

  function selectPath() {
    var pathServer = new PathServer(myDiagram.model.linkDataArray);
    var selection = myDiagram.selection;
    var nodeKey;
    if (selection.count > 0) {
      try {
        var it = selection.iterator;
        while (it.next()) {
          nodeKey = it.value.data.key;
          var allPaths = pathServer.getAllPathsForKey(nodeKey);
          var linksData = myDiagram.model.linkDataArray;
          for (var i = 0, len = allPaths.length, item; i < len; i++) {
            item = allPaths[i].split(',');
            item.forEach(function (e, i) {
              var currentNodeKey = Number(e);
              var anotherNodeKey = Number(item[i + 1]);
              myDiagram.findNodeForKey(currentNodeKey).ib = true;
              if (anotherNodeKey) {
                linksData.forEach(function (e, i) {
                  if (e.from === currentNodeKey && e.to === anotherNodeKey || e.to === currentNodeKey && e.from === anotherNodeKey) {
                    myDiagram.findLinkForData(e).ib = true;
                  }
                });
              }
            });
          }
        }
      } catch (ex) {
      }

    }

  }

  function setTTSPath() {

  }

  function setAudioPath() {

  }

  var actions = {
    blank: newDocument,
    open: openDocument,
    undo: undo,
    redo: redo,
    copy: copyItem,
    paste: pasteItem,
    saveToLocal: saveDocument,
    saveToServer: saveToServer,
    downloadAsPicture: downloadAsPicture,
    downloadAsJson: downloadAsJson,
    loadFromJson: loadFromJson,
    listAllPaths: listAllPaths,
    selectPath: selectPath,
    setTTSPath: setTTSPath,
    setAudioPath: setAudioPath,
    clearCanvas: function () {
      myDiagram.clear()
    }
  };

  $("#menu ul").kendoMenu({
    dataSource: [
      { text: "New", spriteCssClass: "new-item", items: [
        { text: "Blank", spriteCssClass: "blank-item", cssClass: "active" }
      ]
      },
      { text: "Open", encoded: false, spriteCssClass: "open-item", cssClass: "upload-item", cssClass: "active"},
      { text: "Save", spriteCssClass: "save-item", items: [
        { text: "Save to local", encoded: false, spriteCssClass: "save-item", cssClass: "active"},
        { text: "Save to server", encoded: false, spriteCssClass: "save-item", cssClass: "active"}
      ]},
      { text: "Undo", spriteCssClass: "undo-item", cssClass: "active" },
      { text: "Redo", spriteCssClass: "redo-item", cssClass: "active" },
      { text: "Copy", spriteCssClass: "copy-item", cssClass: "active" },
      { text: "Paste", spriteCssClass: "paste-item", cssClass: "active" },
      { text: "Download", spriteCssClass: "download-item", items: [
        { text: "Download as picture", spriteCssClass: "download-picture", cssClass: "active" },
        { text: "Download as json", spriteCssClass: "download-json", cssClass: "active" }
      ] },
      { text: "Load from json", spriteCssClass: "load", cssClass: "active" },
      { text: "Path", spriteCssClass: "path-item", items: [
        { text: "List all paths", spriteCssClass: "list-path-icon", cssClass: "active" },
        { text: "Select path", spriteCssClass: "select-path-icon", cssClass: "active" }
      ] },
      { text: "Clean canvas", spriteCssClass: "clear", cssClass: "active" },
      { text: "Setting", spriteCssClass: "setting-items", items: [
        { text: "TTS services path", spriteCssClass: "tts-path-icon", cssClass: "active" },
        { text: "Audio relative server path", spriteCssClass: "audio-server-path-icon", cssClass: "active" }
      ] }
    ],
    select: function (e) {
      var item = $(e.item),
        itemText = item.children(".k-link").text();

      if (!item.hasClass("active")) {
        return;
      }
      var fn = actions[itemText.charAt(0).toLowerCase() + itemText.slice(1)];
      if (!fn) {
        switch (itemText) {
          case "Save to local":
            fn = actions["saveToLocal"];
            break;
          case "Save to server":
            fn = actions["saveToServer"];
            break;
          case "Download as picture":
            fn = actions["downloadAsPicture"];
            break;
          case "Download as json":
            fn = actions["downloadAsJson"];
            break;
          case "Load from json":
            fn = actions["loadFromJson"];
            break;
          case "List all paths":
            fn = actions["listAllPaths"];
            break;
          case "Select path":
            fn = actions["selectPath"];
            break;
          case "Clean canvas":
            fn = actions["clearCanvas"];
            break;
          case "TTS services path":
            fn = actions["setTTSPath"];
            break;
          case "Audio relative server path":
            fn = actions["setAudioPath"];
            break;
          default:
            fn = actions["saveToLocal"];
            break;
        }
      }
      fn();
    }
  });

  $("#export").on("click", function () {

  });

  $("#upload").kendoUpload({
    async: {
      saveUrl: "save",
      removeUrl: "remove",
      autoUpload: true
    },
    showFileList: false,
    localization: {
      select: ""
    },
    select: function (e) {
      if (typeof(FileReader) !== "undefined") {
        var f = e.files[0].rawFile,
          reader = new FileReader;

        reader.onload = (function (file) {
          return function (e) {
            // diagram.load(JSON.parse(e.target.result));
          };
        })(f);

        reader.readAsBinaryString(f);
      }
    }
  });

  $("#splitter").kendoSplitter({
    panes: [
      { collapsible: true, size: "270px", scrollable: false},
      { collapsible: false, scrollable: false },
      { collapsible: true, size: "300px" }
    ]
  });
  $('#right-pane').css('overflow', 'visible');

  function updateConnectionProperties(shape) {
    $("#connectionStartCap").getKendoDropDownList().value(shape.startCap);
    $("#connectionEndCap").getKendoDropDownList().value(shape.endCap);
  }

  $("#shapesPanelBar").kendoPanelBar({
    expandMode: "multiple"
  }).getKendoPanelBar().expand(">li", false);

  $("#configurationPanelBar").kendoPanelBar({
    expandMode: "multiple"
  }).getKendoPanelBar().expand(">li", false);

  $(".colorPicker").kendoColorPicker({
    value: "#ffffff",
    buttons: false
  });

  $("#canvasLayout").kendoDropDownList({
    dataTextField: "text",
    dataValueField: "value",
    dataSource: [
      { value: "TreeDown", text: "Tree Down" },
      { value: "TreeUp", text: "Tree Up" },
      { value: "TreeLeft", text: "Tree Left" },
      { value: "TreeRight", text: "Tree Right" },
      { value: "RadialTree", text: "Radial Tree" },
      { value: "TipOverTree", text: "Tip-Over Tree" },
      { value: "LayeredHorizontal", text: "Layered Horizontal" },
      { value: "LayeredVertical", text: "Layered Vertical" },
      { value: "ForceDirected", text: "Force directed" },
      { value: "MindmapVertical", text: "Mindmap Vertical" },
      { value: "MindmapHorizontal", text: "Mindmap Horizontal" }
    ]
  });

  $("#connectionStartCap").kendoDropDownList({
    dataTextField: "text",
    dataValueField: "value",
    dataSource: [
      { value: "None", text: "None" },
      { value: "ArrowStart", text: "Arrow Start" },
      { value: "ArrowEnd", text: "Arrow End" },
      { value: "FilledCircle", text: "Filed Circle" }
    ]
  });

  $("#connectionEndCap").kendoDropDownList({
    dataTextField: "text",
    dataValueField: "value",
    dataSource: [
      { value: "None", text: "None" },
      { value: "ArrowStart", text: "Arrow Start" },
      { value: "ArrowEnd", text: "Arrow End" },
      { value: "FilledCircle", text: "Filed Circle" }
    ]
  });

  function updateSliderIndicator(e) {
    var val = e.value;
    $("#diagramZoomIndicator").attr("value", val);
    $("#diagramZoomIndicator").attr("value", val);
    myDiagram.scale = val / 100;
  }

  $("#diagramZoom").kendoSlider({
    min: 10,
    max: 200,
    value: 100,
    smallStep: 10,
    largeStep: 50,
    tickPlacement: "none",
    showButtons: false,
    change: updateSliderIndicator,
    slide: updateSliderIndicator
  });
  -

    $(".numeric").kendoNumericTextBox();

  $("#window").kendoWindow({
    visible: false,
    width: 800,
    resizable: false,
    title: "About"
  });

  $("#about").click(function () {
    $(".about").getKendoWindow().center().open();
  });

  $("#shapesPanelBar .shapeItem").kendoDraggable({
    hint: function () {
      return this.element.clone();
    }
  });

  $("#shapeTitle").kendoComboBox({
    dataTextField: "text",
    dataValueField: "value",
    dataSource: [
      { text: "End", value: "End" },
      { text: "Start", value: "Start" }
    ],
    filter: "contains",
    suggest: true,
    index: 1
  });
  $("#ProContent").click(function () {
    contentEditor.listeners.onActive(this);
  });

  $("#TextAlign").kendoComboBox({
    dataTextField: "text",
    dataValueField: "value",
    dataSource: [
      { text: "Left", value: "left" },
      { text: "Center", value: "center" },
      { text: "Right", value: "right" }
    ],
    filter: "contains",
    suggest: true,
    index: 1
  });
});

function makeMark(container) {
  var markTemplate = '<div class="loadingWrapper"><i> </i><span>Loading...</span></div>';
  $(markTemplate).appendTo(container).css('zIndex', 99999).show();
}
function cleanMark() {
  $('.loadingWrapper').remove();
}

function updateShapeBackground() {
  var i = myDiagram.selection.iterator;
  while (i.next()) {
    myDiagram.model.setDataProperty(i.value.data,
      'color',
      arguments[0]);
  }
  ;
}

function updateShapeStrokeColor() {
  var i = myDiagram.selection.iterator;
  while (i.next()) {
    myDiagram.model.setDataProperty(i.value.data,
      'strokeColor',
      arguments[0]);
  }
  ;
}

function updateProperties(nodeData) {
  nodeData.busType && putNodeProperty(nodeData);
}

function updateCallback(sentence, id) {
  var newRecord = {text: sentence, id: id};
  contentEditor.viewModel.listeners.onUpdate(newRecord);
}

function addContentRecordHandler() {
  function createID() {
    var date = new Date()
    var timeStr = date.getTime().toString();
    var timeStrLength = timeStr.length;
    var cutTimeStr = timeStr.substring(5, timeStrLength);
    var suffix = Math.round(Math.random() * 10000);
    return cutTimeStr + suffix;
  }

  var id = createID();
  contentEditor.viewModel.listeners.onCreate(id, 'listView');
}

function setMainCanvasHeight() {
  var clientHeight = document.body.clientHeight;
  var headerHeight = $('.header').height() + $('.k-menu').height();
  $('#center-pane').add($('.pane-content').eq(1)).add($('#myDiagram')).add($('#myDiagram').children()).css('height', (clientHeight - headerHeight) + 'px');
}

window.onresize = function () {
  setMainCanvasHeight();
  $('#myDiagram').css('height', $('body').height + 'px');
};