package com.bosch.dstools.bls.controller;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.cxf.common.util.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.bosch.dstools.bls.datamodel.CustomerInfo;
import com.bosch.dstools.bls.datamodel.ProcessInfo;
import com.bosch.dstools.bls.datamodel.SectionInfo;
import com.bosch.dstools.bls.datamodel.SectionProcessLink;
import com.bosch.dstools.bls.dbservice.impl.CustomerInfoServiceImpl;
import com.bosch.dstools.bls.dbservice.impl.ProcessInfoServiceImpl;
import com.bosch.dstools.bls.dbservice.impl.SectionInfoServiceImpl;
import com.bosch.dstools.bls.utils.AjaxPrintOut;
import com.bosch.dstools.bls.utils.ProcessStatusEnum;
import com.bosch.dstools.bls.utils.SectionStatusEnum;

@Controller
@RequestMapping("/sectionController")
public class SectionController {

	//Invoking sectionInfo service
	@Resource(name = "sectionInfoService")
	private SectionInfoServiceImpl sectionInfoService;
	
	//Invoking customerinfo service
		@Resource(name = "customerInfoService")
		private CustomerInfoServiceImpl customerInfoService;
		
		@Resource(name = "processInfoService")
		private ProcessInfoServiceImpl processInfoService;
	private static final Logger LOGGER = Logger.getLogger(SectionController.class);
	
	 /**
     * add/register function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/addSection")
    public String addSection(HttpServletRequest request,String sectionName,String sectionId,String sectionDesc, String sectionType,Integer[] processIds,RedirectAttributes attr,Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering addSection(HttpServletRequest,String,String,Model) method");
        }
	     SectionInfo sectInfo = new SectionInfo();
	     sectInfo.setName(sectionName);
	     if("DOM".equals(sectionType)){
	    	 sectInfo.setPdType(1);//0-Project;1-domain
	     }else{
	    	 sectInfo.setPdType(0);//0-Project;1-domain
	     }
	     
	     sectInfo.setDescription(sectionDesc);
	     sectInfo.setSectionNo(sectionId);
	     Object objCust =  request.getSession().getAttribute("customerInfo");
			if(objCust!=null){
				CustomerInfo custInfo = (CustomerInfo)objCust;
				sectInfo.setCreateId(String.valueOf(custInfo.getCustId()));
			}
	     String addResult = sectionInfoService.addSection(sectInfo,processIds);
	    
	     if("SUCCESS".equals(addResult)){
	    	 model.addAttribute("add section Item is error!");
	     }else if("FAILED".equals(addResult)){
	    	 model.addAttribute("add section Item is success!");
	     }
	     attr.addAttribute("sectionType", sectionType);
	     return "redirect:/web/sectionController/mainPage";
    }
    
    
  
    /**
     * add/register function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/getSection", method = RequestMethod.GET)
    public String getSection(HttpServletRequest request,Integer sectionId,String sectionType, String operationType,Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering addSection(HttpServletRequest,String,String,Model) method");
        }
	     SectionInfo sectInfo = sectionInfoService.searchBySectionId(sectionId);
	     List<ProcessInfo> allProcess = processInfoService.listAll(ProcessStatusEnum.DISABLED.getValue(),-1,1000,1,"");
	     List<ProcessInfo> chosedProcess = sectInfo.getProcess();
	     List<ProcessInfo> optionalProcess = null;
	     Map<ProcessInfo,Integer> chosedMap=null;
	     if("UPDATE".equals(operationType)){
		     if(chosedProcess!=null && chosedProcess.size()>0){
		    	 optionalProcess = new ArrayList<ProcessInfo>();
		    	 chosedMap = new HashMap<ProcessInfo,Integer>();
		    	 for(ProcessInfo eachPro: allProcess){
		    		 boolean isInclude=false;
		    		 for(ProcessInfo chosed:chosedProcess){
		    			 if(eachPro.getProcessId()==chosed.getProcessId()){
		    				 isInclude=true;
		    				 break;
		    			 }
		    		 }
		    		 if(isInclude){
		    			 chosedMap.put(eachPro,1);
		    		 }else{
		    			 chosedMap.put(eachPro,0);
		    		 }
		    	 }
		     }else{
		    	 optionalProcess=allProcess;
		     }
	     }
	     request.setAttribute("chosedMap",chosedMap);
	     request.setAttribute("optionalProcess",optionalProcess);
	     request.setAttribute("sectionItem", sectInfo);
	     request.setAttribute("sectionType", sectionType);
	     request.setAttribute("operationType", operationType);
	     return "forward:/web/sectionController/mainPage";
    }
    
    
    
    /**
     * add/register function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/addSectionPage")
    public String addSectionPage(HttpServletRequest request,String sectionType,String searchCondition, Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering addSectionPage(HttpServletRequest,Model) method");
        }
	     List<ProcessInfo> allProcess = processInfoService.listAll(ProcessStatusEnum.DISABLED.getValue(),-1,1000,1,searchCondition);
	     request.setAttribute("allProcess",allProcess);
	     request.setAttribute("operationType", "CREATE");
	     request.setAttribute("sectionType",sectionType);
	     return "/section/section_main";
    }
    
    
	/**
	 * @see secton jsp page
	 * @author Wesley Yang
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/mainPage", method = RequestMethod.GET)
	public String sectionPage(HttpServletRequest request,Integer curPageNo,Integer perPage,Integer curPageLastId,Integer moveDirection,String sectionType,String searchCondition, Model model){
		boolean PROChoosed=true;
		int sectionTypeInt=0;
		if(StringUtils.isEmpty(sectionType)){
			sectionType = request.getParameter("sectionType");
			if(StringUtils.isEmpty(sectionType)){
				sectionType = (String) request.getAttribute("sectionType");
			}
		}
		
			String operationType=(String)request.getAttribute("operationType");
		if("DOM".equals(sectionType)){
			PROChoosed=false;
			sectionTypeInt=1;
		}
		List<SectionInfo> sectionList =null;
		if(curPageNo==null || curPageNo==0){
			 if(perPage==null || perPage<=0){
				 perPage=10;
			 }
			 sectionList = sectionInfoService.findFirstPerPage(sectionTypeInt,perPage.intValue(),searchCondition);
			 curPageNo=1;
		}else{
			sectionList = sectionInfoService.listAll(sectionTypeInt,curPageLastId,perPage,moveDirection,searchCondition);
			 if(moveDirection!=null){
	    		 if(moveDirection==1){
	    			 curPageNo++;
	    		 }else{
	    			 curPageNo--;
	    		 }
    		 }
		}
		Object objCust =  request.getSession().getAttribute("customerInfo");
		SectionInfo curSectionInfo=null;
		if(objCust!=null){
			CustomerInfo sessionCustInfo = (CustomerInfo)objCust;
			CustomerInfo custInfo = customerInfoService.getCustomerInfoById(sessionCustInfo.getCustId());
			 if(PROChoosed){
				 if(custInfo.getCurProjectId()!=null && custInfo.getCurProjectId()>0){
					 curSectionInfo = sectionInfoService.searchBySectionId(custInfo.getCurProjectId());
				 }
			 }else{
				 if(custInfo.getCurDomainId()!=null && custInfo.getCurDomainId()>0){
					 curSectionInfo = sectionInfoService.searchBySectionId(custInfo.getCurDomainId());
				 }
			 }
		}
		SectionInfo seInfoObj = (SectionInfo) request.getAttribute("sectionItem");
		
		
		 Integer sectionCount = sectionInfoService.findCount(sectionTypeInt,searchCondition);
		 int pageCount = (sectionCount/perPage)+(sectionCount%perPage>0?1:0);
		 List<Integer> pageList = new ArrayList<Integer>();
		 for(int i =1;i<=pageCount;i++){
			 pageList.add(i);
		 }
		 
		 if(sectionList.size()==1){
			 curPageLastId=sectionList.get(0).getSectionId();
		 }else{
			 for(int i=sectionList.size()-1;i>0;i--){
				 if(sectionList.get(i)!=null){
					 curPageLastId=sectionList.get(i).getSectionId();
					 break;
				 }
			 }
		}
		 
		request.setAttribute("totalPages", pageCount);
		 request.setAttribute("pageList", pageList);
		 request.setAttribute("curPageNo", curPageNo);
		 request.setAttribute("perPage",perPage);
		 request.setAttribute("curPageLastId",curPageLastId);
		 
		 
		 request.setAttribute("allCount",sectionCount);
		request.setAttribute("operationType", operationType);
		request.setAttribute("sectionType",sectionType);
		request.setAttribute("sectionList",sectionList);
		request.setAttribute("curSectionInfo",curSectionInfo);
		request.setAttribute("sectionItem", seInfoObj);
		request.setAttribute("searchCondition", searchCondition);
		if("PRO".equals(sectionType)){
			return "/section/section_main";
		}else if("DOM".equals(sectionType)){
			return "/section/section_main";
		}else {
			return "redirect:/web/customerController/mainPage";
		}
		
	}
	

	 /**
    * update function
    * @param model
    * @param id
    * @return
    */
   @RequestMapping(value="/updateSection")
   public String updateSection(HttpServletRequest request,Integer id,String sectionName,String sectionId,String sectionDesc, String sectionType,Integer[] processLinkedId,RedirectAttributes attr,Model model)
   {
	     if(LOGGER.isDebugEnabled()) {
           LOGGER.debug("entering updateSection(HttpServletRequest,String,String,Model) method");
       }
	     SectionInfo sectInfo = sectionInfoService.searchBySectionId(id);
	     if(sectInfo!=null){
	    	 sectInfo.setName(sectionName);
	    	 
		     sectInfo.setDescription(sectionDesc);
		     sectInfo.setSectionNo(sectionId);
		     
		     if(sectionInfoService.modifySection(sectInfo,processLinkedId)){
		    	 model.addAttribute("The section Item has updated success!");
		     }else{
		    	 model.addAttribute("The section Item has updated failed!");
		     }
	     }else{
	    	 model.addAttribute("The section"+sectionId+" has been deleted!");
	     }
	     attr.addAttribute("sectionType", sectionType);
	     return "redirect:/web/sectionController/mainPage";
   }
   
   /**
    * add/register function
    * @param model
    * @param id
    * @return
    */
   @RequestMapping(value="/sectionOper", method = RequestMethod.POST)
   public void sectionOper(HttpServletRequest request,Integer sectionId,String sectionType,Integer preState,Integer changeState,String operType,Integer [] processIds,HttpServletResponse response)
   {
	     if(LOGGER.isDebugEnabled()) {
           LOGGER.debug("entering addSection(HttpServletRequest,String,String,Model) method");
       }
	     boolean iscanUpdate=true;
	 	PrintWriter out = null;
		out = AjaxPrintOut.getPrintWriterOut(response);
		if(StringUtils.isEmpty(String.valueOf(sectionId))){
			 iscanUpdate=false;
			 out.print("EMPTY");//The id is empty.
		}else{
		     SectionInfo sectInfo = sectionInfoService.searchBySectionId(sectionId);
		    if("lock".equals(operType)&&sectInfo.getPdStatus()!=SectionStatusEnum.BIND.getValue()){
			     if(sectInfo!=null && sectInfo.getPdStatus()==preState){
			    	 sectInfo.setPdStatus(changeState);
			     }else{
			    	 iscanUpdate=false;
			    	 out.print("INCON");//Inconsistent state
			     }
		     }else if("unlock".equals(operType) && sectInfo.getPdStatus()==SectionStatusEnum.BIND.getValue()){
		    	 if(sectInfo!=null && sectInfo.getPdStatus()==preState){
			    	 sectInfo.setPdStatus(changeState);
			     }else{
			    	 iscanUpdate=false;
			    	 out.print("INCON");//Inconsistent state
			     }
		     }
		    try{
		    	if( iscanUpdate){
		    		sectionInfoService.modifySection(sectInfo,processIds);
		    		out.print("S");//SUCESSFUL
		    	}
		    }catch(Exception e){
		    	e.printStackTrace();
		    	System.out.println("=========In the exception==="+e.getMessage());
		    	 out.print("F");//FAIL
		    }
		}
		out.flush();
   }
   
   /**
    * update function
    * @param model
    * @param id
    * @return
    */
   @RequestMapping(value="/activeSection")
   public String activeSection(HttpServletRequest request,Integer id,String sectionType,String operType,RedirectAttributes attr,Model model)
   {
	     if(LOGGER.isDebugEnabled()) {
           LOGGER.debug("entering updateSection(HttpServletRequest,String,String,Model) method");
       }
	     if(!StringUtils.isEmpty(String.valueOf(id))){
	    	 SectionInfo sectInfo = sectionInfoService.searchBySectionId(id);
	    	 if(sectInfo!=null){
	    		 if(request.getSession().getAttribute("customerInfo")!=null){
	        		 CustomerInfo sessionCust = (CustomerInfo) request.getSession().getAttribute("customerInfo");
	        		 CustomerInfo dataCust = customerInfoService.getCustomerInfoById(sessionCust.getCustId());
	        		 boolean operDone=true;
	        		 if("ACTIVE".equals(operType)){
	        			 if("PRO".equals(sectionType)){
		        			 dataCust.setCurProjectId(id);
		        		 }else if("DOM".equals(sectionType)){
		        			 dataCust.setCurDomainId(id);
		        		 }else{
		        			 operDone=false;
		        			 model.addAttribute("MSG","The section type ["+sectionType+"] is wrong!");
		        		 }
	        		 }else if("UNACTIVE".equals(operType)){
	        			 if("PRO".equals(sectionType)){
		        			 dataCust.setCurProjectId(-1);
		        		 }else if("DOM".equals(sectionType)){
		        			 dataCust.setCurDomainId(-1);
		        		 }else{
		        			 operDone=false;
		        			 model.addAttribute("MSG","The section type ["+sectionType+"] is wrong!");
		        		 }
	        		 }else{
	        			 operDone=false;
	        			 model.addAttribute("MSG","The oper type ["+sectionType+"] is wrong!");
	        		 }
	        		if(operDone){
	        			int operResult=customerInfoService.modifyCustomer(dataCust);
	        			request.getSession().setAttribute("customerInfo", dataCust);
	        			if(operResult!=0){
	        				if("PRO".equals(sectionType)){
	        					model.addAttribute("MSG","The  Project has active sucessfully!");
	        				}else{
	        					model.addAttribute("MSG","The  Domain has active sucessfully!");
	        				}
	        			}else{
	        				if("PRO".equals(sectionType)){
	        					model.addAttribute("MSG","The Project has active failed!");
	        				}else{
	        					model.addAttribute("MSG","The  Domain has active failed!");
	        				}
	        			}
	        		}
	        	 }else{
	        		 model.addAttribute("MSG","The user does not useful!");
	        	 }
	    	 }else{
	    		 model.addAttribute("MSG","The section ["+id+"] does not exist!");
	    	 }
	     }else{
	    	 model.addAttribute("MSG","The sectionId is empty!");
	     }
    	
	     attr.addAttribute("sectionType", sectionType);
	     return "redirect:/web/sectionController/mainPage";
   }
   
   @RequestMapping(value="/obtainSectionByNo", method = RequestMethod.GET)
	public void obtainSectionByNo(HttpServletRequest request,String sectionNo,Integer sectionType,HttpServletResponse response){
		PrintWriter out = null;
		out = AjaxPrintOut.getPrintWriterOut(response);
		if(!StringUtils.isEmpty(sectionNo)){
			SectionInfo sectionInfo=	sectionInfoService.searchBySectionNo(sectionType, sectionNo);
			if(sectionInfo==null){
				out.print("NO");
			}else{
				out.print("YES");
			}
		}else{
			out.print("EMPTY");
		}
		out.flush();
	}
}
