package com.bosch.dstools.bls.dbservice;

import java.util.List;

import com.bosch.dstools.bls.datamodel.CustomerInfo;

public interface ICustomerInfoService {
	//For login function
	public CustomerInfo login(String loginId,String loginPwd);
	//For check email whether exist
	public CustomerInfo checkEmailAddr(String emailAddr);
	//Get the lastest CustomerInfo
	public CustomerInfo getCustomerInfoById(Integer customerId);
	//Register customer by loginId and  password
	public Integer addCustomer(CustomerInfo custInfo);
	// List all customers
	public List<CustomerInfo> listAll(Integer curPageLastId,Integer perPage,Integer moveDirection,String searchCondition);
	// List all customers
	public List<CustomerInfo> findFirstPerPage(String searchCondition,Integer perPage);
	//Modify customerInfo
	public int modifyCustomer(CustomerInfo custInfo);
	//block customerInfo
	public int freezeCustomer(CustomerInfo custInfo);
	//unblock customerInfo
	public int unFreezeCustomer(CustomerInfo custInfo);
	//find customer's count
	public Integer findCount(String searchCondition);
	//find customers by critical
	public List<CustomerInfo> findByCritical(String critical);
	//find customers by critical
	public int findByCriticalCount(String critical);
}
