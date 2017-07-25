package com.bosch.dstools.bls.dbservice;

import java.util.List;

import com.bosch.dstools.bls.datamodel.PathMap;
import com.bosch.dstools.bls.datamodel.ProcessInfo;
import com.bosch.dstools.bls.datamodel.TTSContent;

public interface IProcessInfoService {
	 
	//add process data
	public Integer addProcess(ProcessInfo procInfo);
	// List all processes
	public List<ProcessInfo> listAll(int processStatus,int curPageLastId,
			int perPage,int moveDirection,String searchCondition);
	//find the count by the condition
	public int findCount(int processStatus, String searchCondition);
	//Modify process
	public boolean modifyProcess(ProcessInfo procInfo);
	//Search process by Id
	public ProcessInfo searchProcessById(Integer processId);
	//Search process by process No.
	public ProcessInfo searchProcessByProcessNo(String processNo);
	//search audio URL from database
	public TTSContent searchAudioPath(Integer processId,Integer shapeId);
	//Save audioURL to processAudio table
	public boolean addAudioPath(TTSContent content);
	//Update audioURL to processAudio table
	public boolean updateAudioPath(TTSContent content);
	//obtain value by key
	public PathMap obtainValue(String keyContent,String type);
	//update key and value
	public boolean updateMap(PathMap pathMap );
}
