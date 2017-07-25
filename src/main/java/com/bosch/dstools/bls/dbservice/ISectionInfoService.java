package com.bosch.dstools.bls.dbservice;

import java.util.List;

import com.bosch.dstools.bls.datamodel.SectionInfo;
import com.bosch.dstools.bls.datamodel.SectionProcessLink;

public interface ISectionInfoService {
	 
	//Add Section function
	public String addSection(SectionInfo sectInfo,Integer[] processIds);
	// List all projects or domains
	public List<SectionInfo> listAll(int sectionType,int curPageLastId,int perPage,int moveDirection,String searchCondition);
	//Modify sectionInfo
	public boolean modifySection(SectionInfo sectInfo,Integer[] processIds);
	//Search By section Id
	public SectionInfo searchBySectionId(Integer sectionId);
	//add Section Process relationship
	public Integer addSectionProcessRel(SectionProcessLink spLink);
	//delete Section process relationship
	public Integer deleteSectionProcessRel(SectionProcessLink spLink);
	//find the first page sections
	public List<SectionInfo> findFirstPerPage(int sectionType,int perPage,String searchCondition);
	//find the section's count
	public int findCount(int sectionType,String searchCondition);
	//find the section by section No.
	public SectionInfo searchBySectionNo(int sectionType,String sectionNo);
}
