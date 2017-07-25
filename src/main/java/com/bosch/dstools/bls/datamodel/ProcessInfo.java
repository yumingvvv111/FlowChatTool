package com.bosch.dstools.bls.datamodel;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

/**
 * For Process information
 * @author wesley yang
 *
 */
public class ProcessInfo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 3441872523267831271L;
	private Integer processId;
	private String processNo;
	private String processName;
	private String createId;
	private String processType;
	private String description;
	private Integer state;
	private String strState;
	private Integer version;
	private Timestamp createTime;
	private Timestamp updateTime;
	private String content;
	private String filePath;
	private List<SectionInfo> section;
	 
	public Integer getProcessId() {
		return processId;
	}
	public void setProcessId(Integer processId) {
		this.processId = processId;
	}
	public String getProcessNo() {
		return processNo;
	}
	public void setProcessNo(String processNo) {
		this.processNo = processNo;
	}
	public String getProcessName() {
		return processName;
	}
	public void setProcessName(String processName) {
		this.processName = processName;
	}
	 
	public String getCreateId() {
		return createId;
	}
	public void setCreateId(String createId) {
		this.createId = createId;
	}
	public String getProcessType() {
		return processType;
	}
	public void setProcessType(String processType) {
		this.processType = processType;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public Integer getVersion() {
		return version;
	}
	public void setVersion(Integer version) {
		this.version = version;
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
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<SectionInfo> getSection() {
		return section;
	}
	public void setSection(List<SectionInfo> section) {
		this.section = section;
	}
	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		return super.equals(obj);
	}
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return this.processId*createId.hashCode()*description.hashCode()*updateTime.hashCode();
	}
	public String getStrState() {
		return strState;
	}
	public void setStrState(String strState) {
		this.strState = strState;
	}
	
}
