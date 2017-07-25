package com.bosch.dstools.bls.dbservice.impl;

import java.sql.Timestamp;
import java.util.List;

import javax.annotation.Resource;

import org.apache.cxf.common.util.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.bosch.dstools.bls.dao.ICustomerInfoDao;
import com.bosch.dstools.bls.dao.IProcessInfoDao;
import com.bosch.dstools.bls.dao.ISectionInfoDao;
import com.bosch.dstools.bls.dao.impl.CustomerInfoDaoImpl;
import com.bosch.dstools.bls.datamodel.CustomerInfo;
import com.bosch.dstools.bls.datamodel.ProcessInfo;
import com.bosch.dstools.bls.datamodel.SectionInfo;
import com.bosch.dstools.bls.datamodel.SectionProcessLink;
import com.bosch.dstools.bls.dbservice.ICustomerInfoService;
import com.bosch.dstools.bls.dbservice.ISectionInfoService;
import com.bosch.dstools.bls.security.MD5Encryption;
import com.bosch.dstools.bls.utils.CustomerGenderEnum;
import com.bosch.dstools.bls.utils.CustomerStateEnum;
import com.bosch.dstools.bls.utils.CustomerTypeEnum;
import com.bosch.dstools.bls.utils.SectionStatusEnum;

@Repository("sectionInfoService")
public class SectionInfoServiceImpl implements ISectionInfoService{

	@Resource(name = "SectionInfoDao")
	private ISectionInfoDao sectionInfoDao;
	
	private static final Logger LOGGER = Logger.getLogger(CustomerInfoDaoImpl.class);
	@Override
	public String addSection(SectionInfo sectInfo,Integer[] processIds) {
		// TODO Auto-generated method stub
		sectInfo.setPdStatus(SectionStatusEnum.NOR.getValue());
		sectInfo.setCreateTime(new Timestamp(System.currentTimeMillis()));
		sectInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
		sectionInfoDao.addSection(sectInfo);
		Integer addSuccess =0;
	     if(sectInfo.getSectionId()!=null && sectInfo.getSectionId()>0){
	    	 if(processIds!=null && processIds.length>0){
	    		 for(Integer proId:processIds){
	    			 if(proId>0){
		    			 SectionProcessLink  spLink = new SectionProcessLink(sectInfo.getSectionId(),proId);
		    			 try{
			    			 sectionInfoDao.addSectionProcessRel(spLink);
			    			 addSuccess++;
		    			 }catch(Exception e){
		    				 LOGGER.debug("Add the relationship with section and process is wrong, the exception is "+e.getMessage());
		    			 }
		    			
	    			 }
	    		 }
	    		 if(addSuccess == processIds.length){
	 	    		return "SUCCESS"; 
	 	    	 }
	    	 }
	    	 return "SUCCESS"; 
	     }
		return "FAILED";
	}
	@Override
	public List<SectionInfo> listAll(int sectionType,int curPageLastId,int perPage,int moveDirection,String searchCondition) {
		// TODO Auto-generated method stub
		return sectionInfoDao.findAll(sectionType,SectionStatusEnum.FAIL.getValue(),curPageLastId,perPage,moveDirection,searchCondition);
	}
	@Override
	public boolean modifySection(SectionInfo sectInfo,Integer[] processIds) {
		// TODO Auto-generated method stub
		sectionInfoDao.deleteSectionProcessRel(new SectionProcessLink(sectInfo.getSectionId()));
		if(processIds!=null && processIds.length>0){
			for(Integer intPro:processIds){
				if(intPro<=0){
					continue;
				}
				SectionProcessLink spLink = new SectionProcessLink(sectInfo.getSectionId(),intPro);
				sectionInfoDao.addSectionProcessRel(spLink);
			}
		}
		sectInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
		return sectionInfoDao.updateSectionInfo(sectInfo);
	}
	@Override
	public SectionInfo searchBySectionId(Integer sectionId) {
		return sectionInfoDao.searchBysectionId(sectionId);
	}
	@Override
	public Integer addSectionProcessRel(SectionProcessLink spLink) {
		spLink.setCreateTime(new Timestamp(System.currentTimeMillis()));
		return sectionInfoDao.addSectionProcessRel(spLink);
	}
	@Override
	public Integer deleteSectionProcessRel(SectionProcessLink spLink) {
		// TODO Auto-generated method stub
		return sectionInfoDao.deleteSectionProcessRel(spLink);
	}
	@Override
	public List<SectionInfo> findFirstPerPage(int sectionType,int perPage,String searchCondition) {
		return sectionInfoDao.findFirstPerPage(SectionStatusEnum.FAIL.getValue(), sectionType, perPage,searchCondition);
	}
	@Override
	public int findCount(int sectionType,String searchCondition) {
		// TODO Auto-generated method stub
		return sectionInfoDao.findCount(SectionStatusEnum.FAIL.getValue(), sectionType,searchCondition);
	}
	@Override
	public SectionInfo searchBySectionNo(int sectionType, String sectionNo) {
		// TODO Auto-generated method stub
		return sectionInfoDao.searchBySectionNo(sectionType, sectionNo);
	}
	
}
