package com.bosch.dstools.bls.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.bosch.dstools.bls.datamodel.CustomerInfo;

public interface ICustomerInfoDao {
	//Search Customer by LoginId and password
	public CustomerInfo searchByLoginIdAndPassword(@Param("loginId")String loginId,@Param("loginPwd")String loginPwd);
	//Search Customer by customerId
	public CustomerInfo searchByCustomerId(Integer customerId);
	//Search Customer by emailAddress；
	public CustomerInfo searchByEmailAddr(String emailAddr);
	//add Customer by loginId and password
	public Integer addUser(CustomerInfo custInfo);
	//list all customers
	public List<CustomerInfo> findAll(@Param("curPageLastId")int curPageLastId,@Param("perPage")int perPage,@Param("moveDirection")int moveDirection,@Param("searchCondition")String searchCondition);
	//update CustomerInfo
	public int updateCustomerInfo(CustomerInfo custInfo);
	//find the first page customers
	public List<CustomerInfo> findFirstPage(@Param("searchCondition")String searchCondition,@Param("perPage")Integer perPage);
	//find the counts for customer
	public int findCount(@Param("searchCondition")String searchCondition);
	//find the customers by critical 
	public List<CustomerInfo> findByCritical(String critical);
	//find the customer's count by critical
	public int findCountByCritical(String critical);
}
