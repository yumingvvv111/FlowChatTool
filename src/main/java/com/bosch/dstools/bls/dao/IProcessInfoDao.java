package com.bosch.dstools.bls.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bosch.dstools.bls.datamodel.PathMap;
import com.bosch.dstools.bls.datamodel.ProcessInfo;
import com.bosch.dstools.bls.datamodel.SectionInfo;
import com.bosch.dstools.bls.datamodel.TTSContent;

public interface IProcessInfoDao {
	//add Process
	public Integer addProcess(ProcessInfo procInfo);
	//list all Processes
	public List<ProcessInfo> findAll(@Param("processStatus")int processStatus,@Param("curPageLastId")int curPageLastId,
			@Param("perPage")int perPage,@Param("moveDirection")int moveDirection,@Param("searchCondition")String searchCondition);
	//find the count
	int findCount( @Param("processStatus")int processStatus,@Param("searchCondition")String searchCondition);
	//update ProcessInfo
	public boolean updateProcessInfo(ProcessInfo procInfo);
	//search process by Id
	public ProcessInfo searchProcessById(Integer processId);
	//search process by processNo
	public ProcessInfo searchProcessByProcessNo(String processNo);
	//search audio URL from database
	public TTSContent searchAudioURLByProIDAndShapeId(@Param("processId")Integer processId,@Param("shapeId")Integer shapeId);
	//Save audioURL to processAudio table
	public boolean addProcessAudio(TTSContent content);
	// update the audio URL value with exists record
	public boolean updateProcessAudio(TTSContent content);
	//get value from key
	public PathMap obtainValue(@Param("keyContent")String keyContent,@Param("type")String type);
	//update value 
	public boolean updateMap(PathMap pathMap);
}
