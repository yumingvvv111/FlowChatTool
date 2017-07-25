package com.bosch.dstools.bls.datamodel;

import java.util.Date;

public class PathMap {
	private int mapId;//primary key
	private String kContent;//key content
	private String vContent;//value content
	private String type;
	private Date updateTime;
	public String getkContent() {
		return kContent;
	}
	public void setkContent(String kContent) {
		this.kContent = kContent;
	}
	public String getvContent() {
		return vContent;
	}
	public void setvContent(String vContent) {
		this.vContent = vContent;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getMapId() {
		return mapId;
	}
	public void setMapId(int mapId) {
		this.mapId = mapId;
	}
	
}
