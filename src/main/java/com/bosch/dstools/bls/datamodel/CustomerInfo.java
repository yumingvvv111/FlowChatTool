package com.bosch.dstools.bls.datamodel;

import java.sql.Timestamp;

import com.bosch.dstools.bls.utils.CustomerGenderEnum;

public class CustomerInfo {
	private Integer custId;
	private String loginId;
	private String password;
	private String custName;
	private String emailAddress;
	private Integer state;
	private Timestamp registerTime;
	private Timestamp updateTime;
	private Integer type;
	private Integer gender;
	private Integer curProjectId;
	private Integer curDomainId;
	
	public CustomerInfo() {
		//this.gender=CustomerGenderEnum.CONFIDENTIAL.getValue();
		//this.type=-1;
	}
	public Integer getCustId() {
		return custId;
	}
	public void setCustId(Integer custId) {
		this.custId = custId;
	}
	public String getLoginId() {
		return loginId;
	}
	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getCustName() {
		return custName;
	}
	public void setCustName(String custName) {
		this.custName = custName;
	}
	 
	public String getEmailAddress() {
		return emailAddress;
	}
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	
	public Timestamp getRegisterTime() {
		return registerTime;
	}
	public void setRegisterTime(Timestamp registerTime) {
		this.registerTime = registerTime;
	}
	public Timestamp getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getGender() {
		return gender;
	}
	public void setGender(Integer gender) {
		this.gender = gender;
	}
	public Integer getCurProjectId() {
		return curProjectId;
	}
	public void setCurProjectId(Integer curProjectId) {
		this.curProjectId = curProjectId;
	}
	public Integer getCurDomainId() {
		return curDomainId;
	}
	public void setCurDomainId(Integer curDomainId) {
		this.curDomainId = curDomainId;
	}
	
}
