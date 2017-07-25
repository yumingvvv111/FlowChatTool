package com.bosch.dstools.bls.controller;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import org.apache.cxf.common.util.StringUtils;
import org.apache.log4j.Logger;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import com.bosch.dstools.bls.datamodel.CustomerInfo;
import com.bosch.dstools.bls.dbservice.impl.CustomerInfoServiceImpl;
import com.bosch.dstools.bls.utils.CustomerStateEnum;
import com.bosch.dstools.bls.utils.CustomerTypeEnum;

@Controller
@RequestMapping("/customerController")
public class CustomerController {
	
	//Invoking customerinfo service
	@Resource(name = "customerInfoService")
	private CustomerInfoServiceImpl customerInfoService;
	private static final Logger LOGGER = Logger.getLogger(CustomerController.class);
	
	/**
     * Login function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/login" , method = RequestMethod.POST)
    public ModelAndView login(HttpServletRequest request,String loginId,String loginPwd,RedirectAttributes attr,Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering login(HttpServletRequest,String,String,Model) method");
        }
	     CustomerInfo customerInfo = customerInfoService.login(loginId, loginPwd);
	     if(customerInfo==null){
	    	 model.addAttribute("Your password is wrong!");
	    	 request.getSession().setAttribute("customerInfo",null);
	    	 return new ModelAndView("redirect:/web/customerController/loginPage");	
	     }else{
	    	 request.getSession().setAttribute("customerInfo",customerInfo);
	    	 attr.addAttribute("curPageNo", 0);
	    	 attr.addAttribute("perPage", 10);
	    	 attr.addAttribute("curPageLastId", 0);
	    	 attr.addAttribute("moveDirection", 0);
	    	 attr.addAttribute("displayMsgFlag", "Welcome, "+customerInfo.getCustName()+" back!");
	    	 return new ModelAndView("redirect:/web/customerController/mainPage");
	     }
    }
    
	/**
     * Login function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/logout")
    public String logout(HttpServletRequest request,Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering logout(HttpServletRequest,Model) method");
        }
	     if(request.getSession().getAttribute("customerInfo")!=null){
	    	 request.getSession().setAttribute("customerInfo",null);
	     }
	     return "redirect:/web/customerController/loginPage";
    }
    
    
    
    @RequestMapping(value="/mainPage" , method = RequestMethod.GET)
    public String loadMain(HttpServletRequest request,Integer curPageNo,Integer perPage,Integer curPageLastId,Integer moveDirection,String searchCondition,String displayMsgFlag,Model model){
    	 if(LOGGER.isDebugEnabled()) {
             LOGGER.debug("entering loadMain(HttpServletRequest,String,String,Model) method");
         }
    	 Object customerInfoObj = request.getSession().getAttribute("customerInfo");
    	 String showPart = String.valueOf(request.getAttribute("showPart"));
    	 
    	 if(customerInfoObj!=null){
    		 
    		 List<CustomerInfo> customerInfoList = null;
    		 if(curPageNo==null ||  curPageNo<=0){
    			 if(perPage==null || perPage<=0){
    				 perPage=10;
    			 }
    			 customerInfoList = customerInfoService.findFirstPerPage(searchCondition,perPage);
    			 curPageNo=1;
    			}else{
    				customerInfoList=customerInfoService.listAll(curPageLastId,perPage,moveDirection,searchCondition);
    				 if(moveDirection!=null){
    		    		 if(moveDirection==1){
    		    			 curPageNo++;
    		    		 }else{
    		    			 curPageNo--;
    		    		 }
    	    		 }
    			}
    		
    		 Integer customerCount = customerInfoService.findCount(searchCondition);
    		 int pageCount = (customerCount/perPage)+(customerCount%perPage>0?1:0);
    		 List<Integer> pageList = new ArrayList<Integer>();
    		 for(int i =1;i<=pageCount;i++){
    			 pageList.add(i);
    		 }
    		 
    		 if(customerInfoList.size()==1){
    			 curPageLastId=customerInfoList.get(0).getCustId();
    		 }else{
    			 for(int i=customerInfoList.size()-1;i>0;i--){
    				 if(customerInfoList.get(i)!=null){
    					 curPageLastId=customerInfoList.get(i).getCustId();
    					 break;
    				 }
    			 }
    		}
    		 
    		
    		 request.setAttribute("totalPages", pageCount);
    		 request.setAttribute("pageList", pageList);
    		 request.setAttribute("allCount", customerCount);
    		 request.setAttribute("curPageNo", curPageNo);
    		 request.setAttribute("perPage",perPage);
    		 request.setAttribute("curPageLastId",curPageLastId);
    		 request.setAttribute("showPart",showPart);
    		 request.setAttribute("curCustInfo", request.getAttribute("curCustInfo"));
    		 request.setAttribute("DISPLAYMSGCONTENT",displayMsgFlag);
    		 request.setAttribute("customerInfoList", customerInfoList);
    		 request.setAttribute("searchCondition",searchCondition);
    		return "customer/bls_management";
    	 }else{
    		return "customer/bls_login";
    	 }
    }
    
    
     
    @RequestMapping(value="/freezeCustomer" , method = RequestMethod.GET)
    public String blockCustomer(HttpServletRequest request,String custId, String custState, Model model){
    	 if(LOGGER.isDebugEnabled()) {
             LOGGER.debug("entering blockCustomer(HttpServletRequest,String,Model) method");
         }
    	 CustomerInfo custInfo = new CustomerInfo();
    	 custInfo.setCustId(Integer.valueOf(custId));
    	 custInfo.setState(CustomerStateEnum.FREE.getValue());
    	 int operResult = customerInfoService.freezeCustomer(custInfo);
    	 if(operResult>0){
    		 model.addAttribute("freeze Customer is sucessfully!");
    	 }else{
    		 model.addAttribute("freeze customer is failed!");
    	 }
    	 return  "redirect:/web/customerController/mainPage";
    }
    
    @RequestMapping(value="/unFreezeCustomer" , method = RequestMethod.GET)
    public String unBlockCustomer(HttpServletRequest request,String custId, String custState, Model model){
    	 if(LOGGER.isDebugEnabled()) {
             LOGGER.debug("entering blockCustomer(HttpServletRequest,String,Model) method");
         }
    	 CustomerInfo custInfo = new CustomerInfo();
    	 custInfo.setCustId(Integer.valueOf(custId));
    	 custInfo.setState(CustomerStateEnum.FREE.getValue());
    	 int operResult = customerInfoService.unFreezeCustomer(custInfo);
    	 if(operResult>0){
    		 model.addAttribute("unFreeze Customer is sucessfully!");
    	 }else{
    		 model.addAttribute("unFreeze customer is failed!");
    	 }
    	 return  "redirect:/web/customerController/mainPage";
    }
    
    
    
    /**
     * add/register function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/addCustomer" , method = RequestMethod.POST)
    public String addCustomer(HttpServletRequest request,String loginId,String loginPwd,@RequestParam(value="custName", required=false)String custName,@RequestParam(value="custGender", required=false)String gender,@RequestParam(value="userType", required=false)String custType,String operateType,RedirectAttributes attr,Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering addCustomer(HttpServletRequest,String,String,Model) method");
        }
	     CustomerInfo custInfo = new CustomerInfo();
	     custInfo.setLoginId(loginId);
	     custInfo.setPassword(loginPwd);
	     if(!StringUtils.isEmpty(gender)){
	    	 custInfo.setGender(Integer.valueOf(gender));
	     }
	     
	     if(!StringUtils.isEmpty(custType)){
	    	 custInfo.setType(Integer.valueOf(custType));
	     }
	     if(!StringUtils.isEmpty(custName)){
	    	 custInfo.setCustName(custName);
	     }
	     Integer customerId = customerInfoService.addCustomer(custInfo);
	     if("REGISTER".equals(operateType)){
		     if(customerId==null || customerId==-1){
		    	 model.addAttribute("Register customer is wrong!");
		    	 return "customer/bls_register";
		     }else{
		    	 model.addAttribute("Register customer is success!");
		    	 return "customer/bls_login";
		     }
	     }else{
	    	 attr.addAttribute("curPageNo",0);
	    	 attr.addAttribute("perPage",10);
	    	 attr.addAttribute("curPageLastId",0);
	    	 attr.addAttribute("displayMsgFlag", "Create customer , "+custName+" successs!");
	    	 return  "redirect:/web/customerController/mainPage";
	     }
	     
    }
    
    
    
    /**
     * update customer function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/updateCustomer")
    public String updateCustomer(HttpServletRequest request,String custId,String emailAddress,String custName,String gender,String custState, String custType,RedirectAttributes attr,Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering addCustomer(HttpServletRequest,String,String,Model) method");
        }
	     CustomerInfo custInfo = new CustomerInfo();
	     custInfo.setCustId(Integer.valueOf(custId));
	     custInfo.setEmailAddress(emailAddress);
	     if(!StringUtils.isEmpty(gender)){
	    	 custInfo.setGender(Integer.valueOf(gender));
	     }
	     
	     if(!StringUtils.isEmpty(custType)){
	    	 custInfo.setType(Integer.valueOf(custType));
	     }
	     if(!StringUtils.isEmpty(custName)){
	    	 custInfo.setCustName(custName);
	     }
	     if(!StringUtils.isEmpty(custState)){
	    	 custInfo.setState(Integer.valueOf(custState));
	     }
	     int customerUpdate = customerInfoService.modifyCustomer(custInfo);
	     if(customerUpdate!=0){
	    	 model.addAttribute("update Customer is sucessfully!");
	    	 attr.addAttribute("displayMsgFlag", "Update customer , "+custName+" successs!");
	    	 return  "redirect:/web/customerController/mainPage";
	     }else{
	    	 model.addAttribute("update Customer is failed!");
	    	 attr.addAttribute("displayMsgFlag", "Update customer , "+custName+" failed!");
	    	 return  "redirect:/web/customerController/mainPage";
	     }
	     
    }
    

    /**
     * update customer function
     * @param model
     * @param id
     * @return
     */
    @RequestMapping(value="/displayCustomer" )
    public String displayCustomer(HttpServletRequest request,String disCustId,String showPart,Model model)
    {
	     if(LOGGER.isDebugEnabled()) {
            LOGGER.debug("entering displyCustomer(HttpServletRequest,String,String,Model) method");
        }
	     if(StringUtils.isEmpty(disCustId)){
	    	 disCustId = request.getParameter("disCustId");
	     }
	     if(StringUtils.isEmpty(disCustId)){
	    	 model.addAttribute("Error", "The parameter custId is empty!");
	    	 return  "redirect:/web/customerController/mainPage"; 
	     }
	     Integer customerId = Integer.valueOf(disCustId);
	     CustomerInfo custInfo = customerInfoService.getCustomerInfoById(customerId);
	      
	      
	     if(custInfo!=null){
	    	 request.setAttribute("curCustInfo", custInfo);
	    	 request.setAttribute("showPart",showPart);
	    	 return  "forward:/web/customerController/mainPage";
	     }else{
	    	 model.addAttribute("Display customer is error!");
	    	 return  "redirect:/web/customerController/mainPage";
	     }
	     
    }
    
	/**
	 * @see login jsp page
	 * @author Wesley Yang
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/loginPage", method = RequestMethod.GET)
	public String loginPage(HttpServletRequest request,Model model){
		return "/customer/bls_login";
	} 
	
	
	/**
	 * @see register jsp page
	 * @author Wesley Yang
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/registerPage", method = RequestMethod.GET)
	public String registerPage(HttpServletRequest request,Model model){
		return "/customer/bls_register";
	} 
	
	/**
	 * @see register jsp page
	 * @author Wesley Yang
	 * @param request
	 * @param model
	 * @return
	 */
	@SuppressWarnings("null")
	@RequestMapping(value="/checkLoginIdUsed", method = RequestMethod.GET)
	public void checkLoginIdUsed(HttpServletRequest request,String loginId,HttpServletResponse response){
		PrintWriter out = null;
		out = getPrintWriterOut(response);
		if(!StringUtils.isEmpty(loginId)){
			CustomerInfo custInfo=	customerInfoService.checkEmailAddr(loginId);
			if(custInfo==null){
				out.print("NO");
			}else{
				out.print("YES");
			}
		}else{
			out.print("EMPTY");
		}
		out.flush();
	} 
	
	/**
	 * 
	 * @param response
	 * @return
	 */
	private PrintWriter getPrintWriterOut(HttpServletResponse response){
		response.setContentType("text/plain");//set the output is text flush;
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = null;
		try{
			out = response.getWriter();
		}catch(IOException e){
			e.printStackTrace();
		}
		return out;
	}
}
