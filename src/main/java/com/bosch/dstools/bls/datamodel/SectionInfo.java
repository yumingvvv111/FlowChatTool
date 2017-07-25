package com.bosch.dstools.bls.datamodel;

import java.sql.Timestamp;
import java.util.List;
/**
 * For project and domain information
 * @author yang
 *
 */
public class SectionInfo {
	private Integer sectionId;
	private String sectionNo;
	private String name;
	private String description;
	private String createId;
	private Integer pdType;
	private String pdStrType;
	private Integer pdStatus;
	private Integer isActive;
	private Timestamp createTime;
	private Timestamp updateTime;
	private List<ProcessInfo> process;
	 
	 
	public Integer getSectionId() {
		return sectionId;
	}
	public void setSectionId(Integer sectionId) {
		this.sectionId = sectionId;
	}
	public String getSectionNo() {
		return sectionNo;
	}
	public void setSectionNo(String sectionNo) {
		this.sectionNo = sectionNo;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getCreateId() {
		return createId;
	}
	public void setCreateId(String createId) {
		this.createId = createId;
	}
	public Integer getPdType() {
		return pdType;
	}
	public void setPdType(Integer pdType) {
		this.pdType = pdType;
	}
	public String getPdStrType() {
		return pdStrType;
	}
	public void setPdStrType(String pdStrType) {
		if(this.pdType==1){
			this.pdStrType="DOM";
		}else{
			this.pdStrType="PRO";
		}
	}
	
	public Integer getPdStatus() {
		return pdStatus;
	}
	public void setPdStatus(Integer pdStatus) {
		this.pdStatus = pdStatus;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	public Timestamp getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}
	public Integer getIsActive() {
		return isActive;
	}
	public void setIsActive(Integer isActive) {
		this.isActive = isActive;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<ProcessInfo> getProcess() {
		return process;
	}
	public void setProcess(List<ProcessInfo> process) {
		this.process = process;
	}
}
