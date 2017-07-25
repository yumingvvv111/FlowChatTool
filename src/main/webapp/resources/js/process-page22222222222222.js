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
          new yy.Binding("figure", "shapeType", convertShapeType),
          new yy.Binding("strokeDashArray", "busType", function (s) {
            return (s === 'AND' || s === 'OR') ? [4, 2] : null;
          })
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
//          new go.Binding("minSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          new yy.Binding('stroke', 'strokeColor'),
          new yy.Binding("strokeWidth", "strokeWidth")
        ),
        _$(yy.Panel, "Vertical", {
            defaultAlignment: yy.Spot.Left
          },
          _$(go.TextBlock, {
              alignment: yy.Spot.TopCenter,
              name: "TITLE",
              textAlign: "left",
              margin: 6,
              wrap: go.TextBlock.WrapFit,
              editable: true,
              font: "bold 13px Helvetica, Arial, sans-serif",
              minSize: new yy.Size(100, NaN)
            },
            new go.Binding("text", "annotationContent").makeTwoWay()),
          _$(yy.TextBlock,
            {
              alignment: yy.Spot.Top,
              editable: true,
              textAlign: "left",
              margin: 5,
              font: "12px sans-serif",
              wrap: go.TextBlock.WrapFit,
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
  var activityNodeTemplate = _$(go.Node, "Auto", {
      toolTip: tooltiptemplate,// use a Binding on the Shape.stroke to show selection
      contextMenu: activityNodeMenu,
      isActionable: false,
//      doubleClick: function (e, node) {
//        myDiagram.commandHandler.editTextBlock();
//      },
      selectionChanged: resetPropertyPanel,
      resizable: true, resizeObjectName: 'SHAPE'
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    _$(go.Shape, "RoundedRectangle",
      { name: "SHAPE",
        fill: defaultNodeFill,
        stroke: defaultStroke,
        parameter1: 5, // corner size
        portId: "",
        fromLinkable: true,
        toLinkable: true,
        cursor: "pointer"},
      new yy.Binding("figure", "shapeType", convertShapeType),
      new yy.Binding("geometry", "geometry", convertShapeType),
      new yy.Binding("fill", "color"),
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      new yy.Binding('stroke', 'strokeColor'),
      new yy.Binding("strokeDashArray", "busType", function (s) {
        return (s === 'AND' || s === 'OR') ? [4, 2] : null;
      }),
      new yy.Binding("strokeWidth", "strokeWidth")),

    _$(go.Panel, "Vertical", {defaultAlignment: go.Spot.TopCenter},
      _$(go.TextBlock, {
          alignment: yy.Spot.TopCenter,
          name: "TITLE",
          textAlign: "left",
          margin: 6,
          wrap: go.TextBlock.WrapFit,
          editable: true,
          font: "bold 13px Helvetica, Arial, sans-serif"
        },
        new go.Binding("desiredSize", "size", function (s) {
          return go.Size.parse((Number(s.split(' ')[0]) - 10) + ' NaN');
        }),
        new yy.Binding("visible", "busType", function (s) {
          if (s === 'OR' || s === 'AND') {
            return !1;
          }
          return !0;
        }),
        new go.Binding("text", "annotationContent").makeTwoWay()),
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
        { width: 5, height: 5, stroke: null,
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
        curve: yy.Link.JumpGap,
        corner: 10,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
        toEndSegmentLength: 20
      },
      new yy.Binding("points").makeTwoWay(),
      _$(yy.Shape, {
        isPanelMain: true,
        stroke: "#ccc",
        strokeWidth: 1
      }),
      _$(yy.Shape, {
        toArrow: "Triangle",
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
        cellSize: new yy.Size(2, 2),
        wrappingColumn: 2,
        spacing: new yy.Size(10, 10)
      })
    }); // end Palette
  var nodeDataArrayForPalettel = [
    {
      key: 11,
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
      key: 12,
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
      key: 15,
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
      key: 801,
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
      key: 111,
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
      key: 112,
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
      key: 201,
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
      key: 18,
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
    'ProContent'];
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

  $('#myPalette1').add('#myPalette2').css('top', '20px');

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
//      '    <input name="cs_anchor1" autocomplete="off" id="cs_slide1_1" type="radio" class="cs_anchor slide">',
//      '    <input name="cs_anchor1" autocomplete="off" id="cs_slide1_2" type="radio" class="cs_anchor slide">',
      '    <input name="cs_anchor1" autocomplete="off" id="cs_play1" type="radio" class="cs_anchor" checked="">',
      '    <input name="cs_anchor1" autocomplete="off" id="cs_pause1" type="radio" class="cs_anchor">',
      '    <ul>',
      '        <div style="width: 100%; visibility: hidden; ">',
      '            {{getSliderContent(0)}}',
      '        </div>',
      compileTemplate(['<li ngg-repeat="list" class="num{{$index}} img">',
        '            {{getSliderContent($index)}}',
        '        </li>'].join(''), allPathRecord),
//      '        <li class="num1 img">',
//      '            <p>3333</p>',
//      '        </li>',
//      '        <li class="num2 img">',
//      '            <p>444444</p>',
//      '        </li>',
      '    </ul>',
      '    <div class="cs_description">',
      compileTemplate(['<label ngg-repeat="list" class="num{{$index}}">',
        '            <span class="cs_title"><span class="cs_wrapper">Path{{$index+1}}</span></span>',
        '        </label>'].join(), allPathRecord),
//      '        <label class="num1">',
//      '            <span class="cs_title"><span class="cs_wrapper">Path2</span></span>',
//      '        </label>',
//      '        <label class="num2">',
//      '            <span class="cs_title"><span class="cs_wrapper">Path3</span></span>',
//      '        </label>',
      '    </div>',
      '    <div class="cs_arrowprev">',
      compileTemplate('<label ngg-repeat="list" class="num{{$index}}" for="cs_slide1_{{$index}}"></label>', allPathRecord),
//      '        <label class="num1" for="cs_slide1_1"></label>',
//      '        <label class="num2" for="cs_slide1_2"></label>',
      '    </div>',
      '    <div class="cs_arrownext">',
      compileTemplate('<label ngg-repeat="list" class="num{{$index}}" for="cs_slide1_{{$index}}"></label>', allPathRecord),
      '    </div>',
      '    <div class="cs_bullets">',
      compileTemplate(['<label ngg-repeat="list" class="num{{$index}}" for="cs_slide1_{{$index}}">',
        '            <span class="cs_point"></span>',
        '            <span class="cs_thumb">{{nodeDataRecord.annotationContent}}</span>',
        '        </label>'].join(''), allPathRecord),
//      '        <label class="num1" for="cs_slide1_1">',
//      '            <span class="cs_point"></span>',
//      '            <span class="cs_thumb">bbbbbb</span>',
//      '        </label>',
//      '        <label class="num2" for="cs_slide1_2">',
//      '            <span class="cs_point"></span>',
//      '            <span class="cs_thumb">cccccc</span>',
//      '        </label>',
      '    </div>',
      '</div>'
    ].join('');

    function compileTemplate(template, data) {
      var str = '';
      if (/ngg-repeat/.test(template)) {
        var list = data;
        var _arr = [];
        template = template.replace(/\sngg-repeat=\"([^"]+)"/, '');
        for (var $index = 0, len = list.length, item, _str = ''; $index < len; $index++) {
          item = list[$index];
//      title = null;
          _str = template.replace(/{{([^{}]+)}}/g, getStr('item'));
          _arr.push(_str);
        }
        return _arr.join('');
      }
      str = template.replace(/{{([^{}]+)}}/g, getStr('data'));
      function getStr(root){
        return function (a, b, c) {
          if (/\(/.test(b) || /\$/.test(b)) {
            return eval(b);
          } else {
            return eval(root+'.'+b);
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
        width: document.body.clientWidth + 'px',
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
    $('.csslider1').add('.csslider1 ul').add('.csslider1 li').css('height', document.body.clientHeight - 60 + 'px');
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
  $('#myDiagram').css('height', $('body').height + 'px');
  $('#center-pane').add($('.pane-content').eq(1)).add($('#myDiagram')).add($('#myDiagram').children()).css('height', (clientHeight - headerHeight) + 'px');
}

window.onresize = function () {
  setMainCanvasHeight();
};