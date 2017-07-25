package com.bosch.dstools.bls.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bosch.dstools.bls.datamodel.SectionInfo;
import com.bosch.dstools.bls.datamodel.SectionProcessLink;

public interface ISectionInfoDao {
	//add Section
	public Integer addSection(SectionInfo sectionInfo);
	//list all sections
	public List<SectionInfo> findAll(@Param("sectionType")int sectionType,@Param("sectionStatus")int sectionStatus,@Param("curPageLastId")int curPageLastId,
			@Param("perPage")int perPage,@Param("moveDirection")int moveDirection,@Param("searchCondition")String searchCondition);
	//update SectionInfo
	public boolean updateSectionInfo(SectionInfo sectionInfo);
	//search by section Id
	public SectionInfo searchBysectionId(Integer sectionId);
	//add the relationship with section and process
	public Integer addSectionProcessRel(SectionProcessLink spLink);
	//remove the relationship with section and process
	public Integer deleteSectionProcessRel(SectionProcessLink spLink);
	//find the first section page
	List<SectionInfo> findFirstPerPage( @Param("sectionStatus")int sectionStatus,@Param("sectionType")int sectionType,@Param("perPage")int perPage,@Param("searchCondition")String searchCondition);
	//find the count
	int findCount( @Param("sectionStatus")int sectionStatus,@Param("sectionType")int sectionType,@Param("searchCondition")String searchCondition);
	//find the section by critical
	List<SectionInfo> findByCritical(@Param("critical")String critical,@Param("sectionType")String sectionType);
	//Search SectionInfo by sectionId
	public SectionInfo searchBySectionNo(@Param("sectionType")int sectionType,@Param("sectionNo")String sectionNo);
}
