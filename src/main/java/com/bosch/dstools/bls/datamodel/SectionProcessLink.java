package com.bosch.dstools.bls.datamodel;

import java.util.Date;

public class SectionProcessLink {
	private Integer section_id;
	private Integer process_id;
	private SectionInfo section;
	private ProcessInfo process;
	private Date createTime;
	public SectionInfo getSection() {
		return section;
	}
	public void setSection(SectionInfo section) {
		this.section = section;
	}
	public ProcessInfo getProcess() {
		return process;
	}
	public void setProcess(ProcessInfo process) {
		this.process = process;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Integer getSection_id() {
		return section_id;
	}
	public void setSection_id(Integer section_id) {
		this.section_id = section_id;
	}
	public Integer getProcess_id() {
		return process_id;
	}
	public void setProcess_id(Integer process_id) {
		this.process_id = process_id;
	}
	public SectionProcessLink(Integer section_id, Integer process_id) {
		super();
		this.section_id = section_id;
		this.process_id = process_id;
	}
	public SectionProcessLink(Integer section_id) {
		super();
		this.section_id = section_id;
	}
	
}
