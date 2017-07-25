package com.bosch.dstools.bls.dao.impl;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.bosch.dstools.bls.dao.ICustomerInfoDao;

import java.util.List;

import com.bosch.dstools.bls.datamodel.CustomerInfo;

@Repository("CustomerInfoDao")
public class CustomerInfoDaoImpl implements ICustomerInfoDao{

	@Resource(name = "frameworkSqlSession")
	private SqlSession frameworkSqlSession;
	private static final Logger LOGGER = Logger.getLogger(CustomerInfoDaoImpl.class);
	
	public CustomerInfo searchByLoginIdAndPassword(String loginId,
			String loginPwd) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		CustomerInfo customerInfo = customerDao.searchByLoginIdAndPassword(loginId, loginPwd);
		return customerInfo;
	}

	public CustomerInfo searchByCustomerId(Integer customerId) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		CustomerInfo customerInfo = customerDao.searchByCustomerId( customerId);
		return customerInfo;
	}

	public CustomerInfo searchByEmailAddr(String emailAddr) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		CustomerInfo customerInfo = customerDao.searchByEmailAddr(emailAddr);
		return customerInfo;
	}

	@Override
	public Integer addUser(CustomerInfo custInfo) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		customerDao.addUser(custInfo);
		Integer customerId =  custInfo.getCustId();
		return customerId;
	}

	@Override
	public List<CustomerInfo> findAll(int curPageLastId,int perPage,int moveDirection,String searchCondition) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		if(perPage<=0){
			perPage=10;
		}
		return customerDao.findAll(curPageLastId,perPage,moveDirection,searchCondition);
	}

	@Override
	public int updateCustomerInfo(CustomerInfo custInfo) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		int aa=frameworkSqlSession.update("updateCustomerInfo", custInfo);
		System.out.println(aa+"aaa");
		return customerDao.updateCustomerInfo(custInfo);
	}

	@Override
	public List<CustomerInfo> findFirstPage(String searchCondition,Integer perPage) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		return customerDao.findFirstPage(searchCondition,perPage);
	}

	@Override
	public int findCount(String searchCondition) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		return customerDao.findCount(searchCondition);
	}

	@Override
	public List<CustomerInfo> findByCritical(String critical) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		return customerDao.findByCritical(critical);
	}

	@Override
	public int findCountByCritical(String critical) {
		ICustomerInfoDao customerDao = frameworkSqlSession.getMapper(ICustomerInfoDao.class);
		return customerDao.findCountByCritical(critical);
	}


}
