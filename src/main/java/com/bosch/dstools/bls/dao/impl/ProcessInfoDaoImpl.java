package com.bosch.dstools.bls.dao.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.bosch.dstools.bls.dao.ICustomerInfoDao;
import com.bosch.dstools.bls.dao.IProcessInfoDao;
import com.bosch.dstools.bls.datamodel.CustomerInfo;
import com.bosch.dstools.bls.datamodel.PathMap;
import com.bosch.dstools.bls.datamodel.ProcessInfo;
import com.bosch.dstools.bls.datamodel.TTSContent;

@Repository("ProcessInfoDao")
public class ProcessInfoDaoImpl implements IProcessInfoDao {

	@Resource(name = "frameworkSqlSession")
	private SqlSession frameworkSqlSession;
	private static final Logger LOGGER = Logger
			.getLogger(ProcessInfoDaoImpl.class);

	@Override
	public Integer addProcess(ProcessInfo procInfo) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		Integer processId = processDao.addProcess(procInfo);
		return processId;
	}

	@Override
	public List<ProcessInfo> findAll(int processStatus,int curPageLastId,
			int perPage,int moveDirection,String searchCondition) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		List<ProcessInfo> processList = processDao.findAll(processStatus,curPageLastId,perPage,moveDirection,searchCondition);
		return processList;
	}

	@Override
	public boolean updateProcessInfo(ProcessInfo procInfo) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		return processDao.updateProcessInfo(procInfo);
	}

	@Override
	public ProcessInfo searchProcessById(Integer processId) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		return processDao.searchProcessById(processId);
	}

	@Override
	public int findCount(int processStatus, String searchCondition) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		return processDao.findCount(processStatus, searchCondition);
	}

	@Override
	public ProcessInfo searchProcessByProcessNo(String processNo) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		return processDao.searchProcessByProcessNo(processNo);
	}

	@Override
	public TTSContent searchAudioURLByProIDAndShapeId(Integer processId,
			Integer shapeId) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		return processDao.searchAudioURLByProIDAndShapeId(processId, shapeId);
	}

	@Override
	public boolean addProcessAudio(TTSContent content) {
			IProcessInfoDao processDao = frameworkSqlSession
					.getMapper(IProcessInfoDao.class);
			return processDao.addProcessAudio(content);
	}

	@Override
	public boolean updateProcessAudio(TTSContent content) {
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		return processDao.updateProcessAudio(content);
	}

	@Override
	public PathMap obtainValue(String keyContent, String type) {
		// TODO Auto-generated method stub
		IProcessInfoDao processDao = frameworkSqlSession
				.getMapper(IProcessInfoDao.class);
		return processDao.obtainValue(keyContent, type);
	}

	@Override
	public boolean updateMap(PathMap pathMap) {
		// TODO Auto-generated method stub
				IProcessInfoDao processDao = frameworkSqlSession
						.getMapper(IProcessInfoDao.class);
				return processDao.updateMap(pathMap);
	}


 

}
