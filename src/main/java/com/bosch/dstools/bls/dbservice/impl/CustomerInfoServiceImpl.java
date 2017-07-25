package com.bosch.dstools.bls.dbservice.impl;

import java.sql.Timestamp;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.bosch.dstools.bls.dao.ICustomerInfoDao;
import com.bosch.dstools.bls.dao.impl.CustomerInfoDaoImpl;
import com.bosch.dstools.bls.datamodel.CustomerInfo;
import com.bosch.dstools.bls.dbservice.ICustomerInfoService;
import com.bosch.dstools.bls.security.MD5Encryption;
import com.bosch.dstools.bls.utils.CustomerGenderEnum;
import com.bosch.dstools.bls.utils.CustomerStateEnum;
import com.bosch.dstools.bls.utils.CustomerTypeEnum;

@Repository("customerInfoService")
public class CustomerInfoServiceImpl implements ICustomerInfoService{

	@Resource(name = "CustomerInfoDao")
	private ICustomerInfoDao customerInfoDao;
	private static final Logger LOGGER = Logger.getLogger(CustomerInfoDaoImpl.class);
	
	public CustomerInfo login(String loginId, String loginPwd) {
		 loginPwd = MD5Encryption.GetMD5Code(loginPwd);
		return customerInfoDao.searchByLoginIdAndPassword(loginId, loginPwd);
	}

	public CustomerInfo checkEmailAddr(String emailAddr) {
		return customerInfoDao.searchByEmailAddr(emailAddr);
	}

	public CustomerInfo getCustomerInfoById(Integer customerId) {
		return customerInfoDao.searchByCustomerId(customerId);
	}

	@Override
	public Integer addCustomer(CustomerInfo custInfo){
		 String loginPwd = custInfo.getPassword();
		 loginPwd = MD5Encryption.GetMD5Code(loginPwd);
		 custInfo.setPassword(loginPwd);
		 custInfo.setEmailAddress(custInfo.getLoginId());
		 //If there is not gender parameter, then set the default value
		 if(custInfo.getGender()==null || custInfo.getGender()<0){
			 custInfo.setGender(CustomerGenderEnum.CONFIDENTIAL.getValue());
		 }
		 //If there is not type parameter, then set the default value
		 if(custInfo.getType()==null || custInfo.getType()<0){
			 custInfo.setType(CustomerTypeEnum.DEVE.getValue());
		 }
	     custInfo.setRegisterTime(new Timestamp(System.currentTimeMillis()));
	     custInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
	    //The interception of mail in front of the @ symbol part.
	     String defaultCustName = custInfo.getLoginId().trim().substring(0, custInfo.getLoginId().indexOf('@'));
	     custInfo.setCustName(defaultCustName);
	     custInfo.setState(CustomerStateEnum.AUTH.getValue());
		return customerInfoDao.addUser(custInfo);
	}

	@Override
	public List<CustomerInfo> listAll(Integer curPageLastId,Integer perPage,Integer moveDirection,String searchCondition ) {
		// TODO Auto-generated method stub
		return customerInfoDao.findAll(curPageLastId,perPage,moveDirection,searchCondition);
	}

	@Override
	public int modifyCustomer(CustomerInfo custInfo) {
		custInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
		return customerInfoDao.updateCustomerInfo(custInfo);
	}

	@Override
	public int freezeCustomer(CustomerInfo custInfo) {
		CustomerInfo existInfo = customerInfoDao.searchByCustomerId(custInfo.getCustId());
		if(existInfo!=null && existInfo.getState()==CustomerStateEnum.AUTH.getValue()){
			custInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
			int updateState = customerInfoDao.updateCustomerInfo(custInfo);
			return updateState;
		}
		return 0;
	}

	@Override
	/**
	 * This method is unblock the customer;
	 * The state is 
	 */
	public int unFreezeCustomer(CustomerInfo custInfo) {
		CustomerInfo existInfo = customerInfoDao.searchByCustomerId(custInfo.getCustId());
		if(existInfo!=null && existInfo.getState()==CustomerStateEnum.FREE.getValue()){
			custInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
			int updateState = customerInfoDao.updateCustomerInfo(custInfo);
			return updateState;
		}
		return 0;
	}

	@Override
	public Integer findCount(String searchCondition) {
		// TODO Auto-generated method stub
		return customerInfoDao.findCount(searchCondition);
	}

	@Override
	public List<CustomerInfo> findFirstPerPage(String searchCondition,Integer perPage) {
		// TODO Auto-generated method stub
		return customerInfoDao.findFirstPage(searchCondition,perPage);
	}

	@Override
	public List<CustomerInfo> findByCritical(String critical) {
		// TODO Auto-generated method stub
		return customerInfoDao.findByCritical(critical);
	}

	@Override
	public int findByCriticalCount(String critical) {
		// TODO Auto-generated method stub
		return customerInfoDao.findCountByCritical(critical);
	}

}
