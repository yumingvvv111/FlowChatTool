package com.bosch.dstools.bls.dao.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.bosch.dstools.bls.dao.IProcessInfoDao;
import com.bosch.dstools.bls.dao.ISectionInfoDao;
import com.bosch.dstools.bls.datamodel.SectionInfo;
import com.bosch.dstools.bls.datamodel.SectionProcessLink;

@Repository("SectionInfoDao")
public class SectionInfoDaoImpl implements ISectionInfoDao {

	@Resource(name = "frameworkSqlSession")
	private SqlSession frameworkSqlSession;
	private static final Logger LOGGER = Logger.getLogger(ProcessInfoDaoImpl.class);
	
	@Override
	public Integer addSection(SectionInfo sectionInfo) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		Integer sectionId = sectionDao.addSection(sectionInfo);
		return sectionId;
	}

	@Override
	
	
	public List<SectionInfo> findAll(int sectionType,int sectionStatus,int curPageLastId,int perPage,int moveDirection,String searchCondition) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		List<SectionInfo> sectionList = sectionDao.findAll(sectionType,sectionStatus,curPageLastId,perPage,moveDirection,searchCondition);
		return sectionList;
	}

	@Override
	public boolean updateSectionInfo(SectionInfo sectionInfo) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		return sectionDao.updateSectionInfo(sectionInfo);
	}

	@Override
	public SectionInfo searchBysectionId(Integer sectionId) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		return sectionDao.searchBysectionId(sectionId);
	}

	@Override
	public Integer addSectionProcessRel(SectionProcessLink spLink) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		Integer sectionId = sectionDao.addSectionProcessRel(spLink);
		return sectionId;
	}

	@Override
	public Integer deleteSectionProcessRel(SectionProcessLink spLink) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		Integer sectionId = sectionDao.deleteSectionProcessRel(spLink);
		return sectionId;
	}

	@Override
	public List<SectionInfo> findFirstPerPage(int sectionStatus,int sectionType,int perPage,String searchCondition) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		return sectionDao.findFirstPerPage(sectionStatus,sectionType,perPage,searchCondition);
	}

	@Override
	public int findCount(int sectionStatus, int sectionType,String searchCondition) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		return sectionDao.findCount(sectionStatus,sectionType,searchCondition);
	}

	@Override
	public List<SectionInfo> findByCritical(String critical, String sectionType) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public SectionInfo searchBySectionNo(int sectionType, String sectionNo) {
		ISectionInfoDao sectionDao = frameworkSqlSession.getMapper(ISectionInfoDao.class);
		return sectionDao.searchBySectionNo(sectionType, sectionNo);
	}

 

}
