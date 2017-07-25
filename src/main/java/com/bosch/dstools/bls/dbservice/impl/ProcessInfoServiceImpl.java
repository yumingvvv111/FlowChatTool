package com.bosch.dstools.bls.dbservice.impl;

import java.sql.Timestamp;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.bosch.dstools.bls.dao.IProcessInfoDao;
import com.bosch.dstools.bls.datamodel.PathMap;
import com.bosch.dstools.bls.datamodel.ProcessInfo;
import com.bosch.dstools.bls.datamodel.TTSContent;
import com.bosch.dstools.bls.dbservice.IProcessInfoService;

@Repository("processInfoService")
public class ProcessInfoServiceImpl implements IProcessInfoService{

	@Resource(name = "ProcessInfoDao")
	private IProcessInfoDao processInfoDao;
	private static final Logger LOGGER = Logger.getLogger(ProcessInfoServiceImpl.class);
	@Override
	public Integer addProcess(ProcessInfo procInfo) {
		procInfo.setCreateTime(new Timestamp(System.currentTimeMillis()));
		procInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
		return processInfoDao.addProcess(procInfo);
	}
	@Override
	public List<ProcessInfo> listAll(int processStatus,int curPageLastId,
			int perPage,int moveDirection,String searchCondition) {
		return processInfoDao.findAll(processStatus, curPageLastId, perPage, moveDirection, searchCondition);
	}
	@Override
	public boolean modifyProcess(ProcessInfo procInfo) {
		procInfo.setUpdateTime(new Timestamp(System.currentTimeMillis()));
		return processInfoDao.updateProcessInfo(procInfo);
	}
	public IProcessInfoDao getProcessInfoDao() {
		return processInfoDao;
	}
	public void setProcessInfoDao(IProcessInfoDao processInfoDao) {
		this.processInfoDao = processInfoDao;
	}
	@Override
	public ProcessInfo searchProcessById(Integer processId) {
		return  processInfoDao.searchProcessById(processId);
	}
	@Override
	public int findCount(int processStatus, String searchCondition) {
		return  processInfoDao.findCount(processStatus, searchCondition);
	}
	@Override
	public ProcessInfo searchProcessByProcessNo(String processNo) {
		// TODO Auto-generated method stub
		return processInfoDao.searchProcessByProcessNo(processNo);
	}
	@Override
	public TTSContent searchAudioPath(Integer processId, Integer shapeId) {
		return processInfoDao.searchAudioURLByProIDAndShapeId(processId, shapeId);
	}
	@Override
	public boolean addAudioPath(TTSContent content) {
		return processInfoDao.addProcessAudio(content);
	}
	@Override
	public boolean updateAudioPath(TTSContent content) {
		return processInfoDao.updateProcessAudio(content);
	}
	@Override
	public PathMap obtainValue(String keyContent, String type) {
		// TODO Auto-generated method stub
		return processInfoDao.obtainValue(keyContent, type);
	}
	@Override
	public boolean updateMap(PathMap pathMap) {
		// TODO Auto-generated method stub
		return processInfoDao.updateMap(pathMap);
	}
 
}
