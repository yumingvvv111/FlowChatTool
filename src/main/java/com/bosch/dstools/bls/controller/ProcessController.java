package com.bosch.dstools.bls.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.cxf.common.util.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bosch.dstools.bls.datamodel.CustomerInfo;
import com.bosch.dstools.bls.datamodel.PathMap;
import com.bosch.dstools.bls.datamodel.ProcessInfo;
import com.bosch.dstools.bls.datamodel.SectionInfo;
import com.bosch.dstools.bls.datamodel.TTSContent;
import com.bosch.dstools.bls.dbservice.impl.ProcessInfoServiceImpl;
import com.bosch.dstools.bls.utils.AjaxPrintOut;
import com.bosch.dstools.bls.utils.ProcessStatusEnum;

@Controller
@RequestMapping("/processController")
public class ProcessController {
	private final String AUDIO_FOLDER="AUDIO";
		//Invoking processInfo service
		@Resource(name = "processInfoService")
		private ProcessInfoServiceImpl processInfoService;
		private static final Logger LOGGER = Logger.getLogger(ProcessController.class);
		
		 /**
	     * add/register function
	     * @param model
	     * @param id
	     * @return
	     */
	    @RequestMapping(value="/addProcess")
	    public void addProcess(HttpServletRequest request,String processNo,String processName, String processType, String processState,String description,String processContent,Model model,HttpServletResponse response){
		     if(LOGGER.isDebugEnabled()) {
	            LOGGER.debug("entering addProcess(HttpServletRequest,String,String,Model) method");
	        }
		     ProcessInfo procInfo = new ProcessInfo();
		     procInfo.setProcessNo(processNo);
		     procInfo.setProcessName(processName);
		     procInfo.setProcessType(processType);
		     procInfo.setDescription(description);
		     if(!StringUtils.isEmpty(processContent)){
		    	 procInfo.setContent(processContent);
		     }
		     procInfo.setVersion(1);
		     procInfo.setState(1);
		     Object objCust =  request.getSession().getAttribute("customerInfo");
				if(objCust!=null){
					CustomerInfo custInfo = (CustomerInfo)objCust;
					procInfo.setCreateId(String.valueOf(custInfo.getCustId()));
				}
				
		     if(!StringUtils.isEmpty(processState)){
		    	 procInfo.setState(Integer.valueOf(processState));
		     }
		     Integer procId =  processInfoService.addProcess(procInfo);
		     PrintWriter out = null;
				out = AjaxPrintOut.getPrintWriterOut(response);
				out.print(procInfo.getProcessId());
				out.flush();
	    }
	    
	    
	    
		/**
		 * @see process jsp page
		 * @author Wesley Yang
		 * @param request
		 * @param model
		 * @return
		 */
		@RequestMapping(value="/mainPage")
		public String mainPage(HttpServletRequest request,String processOperate,Integer curPageNo,Integer perPage,Integer curPageLastId,Integer moveDirection,String searchCondition,Model model){
			
			
			List<ProcessInfo> processList =null;
			if(curPageNo==null || curPageNo==0){
				 if(perPage==null || perPage<=0){
					 perPage=10;
				 }
				 curPageLastId=-1;
			}
			if(moveDirection==null){
				moveDirection=1;
			}
			if(curPageNo==null){
				curPageNo=0;
			}
			processList = processInfoService.listAll(ProcessStatusEnum.DISABLED.getValue(), curPageLastId, perPage, moveDirection, searchCondition);
			if(moveDirection!=null){
		    	if(moveDirection==1){
		    		curPageNo++;
		    	}else{
		    		curPageNo--;
		    	}
			}
			
			 Integer sectionCount = processInfoService.findCount(ProcessStatusEnum.DISABLED.getValue(),searchCondition);
			 int pageCount = (sectionCount/perPage)+(sectionCount%perPage>0?1:0);
			 List<Integer> pageList = new ArrayList<Integer>();
			 for(int i =1;i<=pageCount;i++){
				 pageList.add(i);
			 }
			 
			 if(processList.size()==1){
				 curPageLastId=processList.get(0).getProcessId();
			 }else{
				 for(int i=processList.size()-1;i>0;i--){
					 if(processList.get(i)!=null){
						 curPageLastId=processList.get(i).getProcessId();
						 break;
					 }
				 }
			}
			//for pagination
			request.setAttribute("totalPages", pageCount);
			 request.setAttribute("pageList", pageList);
			 request.setAttribute("curPageNo", curPageNo);
			 request.setAttribute("perPage",perPage);
			 request.setAttribute("curPageLastId",curPageLastId);
			 request.setAttribute("allCount",sectionCount);
			request.setAttribute("processList",processList);
			request.setAttribute("searchCondition", searchCondition);
			if(StringUtils.isEmpty(processOperate)){
				processOperate="LIST";
			}
			request.setAttribute("processOperate", processOperate);
			return "/process/main";
		} 
		
		

		/**
		 * @see process jsp page
		 * @author Wesley Yang
		 * @param request
		 * @param model
		 * @return
		 */
		@RequestMapping(value="/getProcess")
		public String getProcess(HttpServletRequest request,String processOperate,Integer processId,String searchCondition,Model model){
			ProcessInfo processInfo = processInfoService.searchProcessById(processId);
			request.setAttribute("processItem", processInfo);
			if(StringUtils.isEmpty(processOperate)){
				processOperate="LIST";
			}
			request.setAttribute("processOperate", processOperate);
			return "/process/main";
		} 
		
		/**
		 * @see process jsp page
		 * @author Wesley Yang
		 * @param request
		 * @param model
		 * @return
		 */
		@RequestMapping(value="/getProcessForJSON")
		public void getProcessForJSON(HttpServletRequest request,Integer processId,HttpServletResponse response){
			PrintWriter out = null;
			out = AjaxPrintOut.getPrintWriterOut(response);
			if(!(processId==null || processId<=0)){
			ProcessInfo processInfo = processInfoService.searchProcessById(processId);
				if(processInfo!=null && !StringUtils.isEmpty(processInfo.getContent())){
					out.print(processInfo.getContent());
				}else{
					out.print("EMPTY");
				}
			}else{
				out.print("EMPTY");
			}
				out.flush();
		} 
		
		/**
		 * @see process jsp page
		 * @author Wesley Yang
		 * @param request
		 * @param model
		 * @return
		 */
		@RequestMapping(value="/drawProcessPage", method = RequestMethod.GET)
		public String drawProcessPage(HttpServletRequest request,Model model){
			return "/process/bls_draw_process";
		}
		
		 /**
	     * add/register function
	     * @param model
	     * @param id
	     * @return
	     */
	    @RequestMapping(value="/updateProcess", method = RequestMethod.POST)
	    public String updateProcess(HttpServletRequest request,String id,String processId,String processName, String processType, int processState,String description,Model model)
	    {
		     if(LOGGER.isDebugEnabled()) {
	            LOGGER.debug("entering updateProcess(HttpServletRequest,Integer,String,String...,Model) method");
	        }
		     if(id==null){
		    	 model.addAttribute("MESSAGE", "The process id is null!");
		    	 return "forward:/web/processController/mainPage";
		     }
		     ProcessInfo procInfo = processInfoService.searchProcessById(Integer.valueOf(id));
		     if(procInfo!=null){
		    	 procInfo.setProcessNo(processId);
		    	 procInfo.setProcessName(processName);
			     procInfo.setProcessType(processType);
			     procInfo.setDescription(description);
			     procInfo.setState(processState);
		     }
		     
		     
		     Object objCust =  request.getSession().getAttribute("customerInfo");
				if(objCust!=null){
					CustomerInfo custInfo = (CustomerInfo)objCust;
					procInfo.setCreateId(String.valueOf(custInfo.getCustId()));
				}
				
		      
		     boolean updateResult =  processInfoService.modifyProcess(procInfo);
		     if(updateResult){
		    	 request.setAttribute("processOperate", "LIST");
		    	 model.addAttribute("MESSAGE", "The processId has already updated success!");
		    	 return "forward:/web/processController/mainPage";
		     }else{
		    	 request.setAttribute("processOperate", "UPDATE");
		    	 model.addAttribute("MESSAGE", "Create process successfully!");
		    	 return "forward:/web/processController/mainPage";
		     }
	    }
	    
	    
	    /**
	     * add/register function
	     * @param model
	     * @param id
	     * @return
	     */
	    @RequestMapping(value="/updateProcessContent")
	    public void updateProcessContent(HttpServletRequest request,Integer processId,String processContent,HttpServletResponse response,Model model){
		     if(LOGGER.isDebugEnabled()) {
	            LOGGER.debug("entering updateProcessContent(HttpServletRequest,Integer,String) method");
	        }
		     ProcessInfo procInfo = processInfoService.searchProcessById(processId);
		     if(procInfo!=null){
		    	 procInfo.setContent(processContent);
		    	 Object objCust =  request.getSession().getAttribute("customerInfo");
					if(objCust!=null){
						CustomerInfo custInfo = (CustomerInfo)objCust;
						procInfo.setCreateId(String.valueOf(custInfo.getCustId()));
					}
					
			      
			     boolean updateResult =  processInfoService.modifyProcess(procInfo);
			     PrintWriter out = null;
					out = AjaxPrintOut.getPrintWriterOut(response);
					out.print(procInfo.getProcessId());
					out.flush();
		     }else{
		    	 CustomerInfo custInfo=(CustomerInfo) request.getSession().getAttribute("customerInfo");
		    	 if(custInfo!=null){
		    		 int custId = custInfo.getCustId();
		    		 this.addProcess(request,"ProcessNo_"+custId+System.currentTimeMillis() , "ProcessName_"+custId, String.valueOf(1), String.valueOf(ProcessStatusEnum.EDIT.getValue()), "It's new process,create by "+custInfo.getCustName(), processContent,model, response);
		    	 }
		     }
	    }
	    
	    
		/**
		 * @see process jsp page
		 * @author Wesley Yang
		 * @param request
		 * @param model
		 * @return
		 */
		@RequestMapping(value="/editMode")
		public String editModePage(HttpServletRequest request,Model model){
			return "/process/edit_process_model";
		}
		
		@RequestMapping(value="/obtainProByNo", method = RequestMethod.GET)
		public void obtainProcessByNo(HttpServletRequest request,String processNo,HttpServletResponse response){
			PrintWriter out = null;
			out = AjaxPrintOut.getPrintWriterOut(response);
			if(!StringUtils.isEmpty(processNo)){
				ProcessInfo processInfo=	processInfoService.searchProcessByProcessNo(processNo);
				if(processInfo==null){
					out.print("NO");
				}else{
					out.print("YES");
				}
			}else{
				out.print("EMPTY");
			}
			out.flush();
		}
		
		//obtain value by key
		@RequestMapping(value="/obtainValue", method = RequestMethod.GET)
		public void obtainValueByKey(HttpServletRequest request,String keyContent,String type,HttpServletResponse response){
			PrintWriter out = null;
			out = AjaxPrintOut.getPrintWriterOut(response);
			if(!StringUtils.isEmpty(keyContent)){
				PathMap pathMap=	processInfoService.obtainValue(keyContent, type);
				if(pathMap==null){
					out.print("NO");
				}else{
					out.print(pathMap.getvContent());
				}
			}else{
				out.print("EMPTY");
			}
			out.flush();
		}
		
		
		/**
		 * @see invoke TTS service and get the audio
		 * @author Wesley Yang
		 * @param request
		 * @param model
		 * @return
		 */
		@RequestMapping(value="/obtainAudioPath", method = RequestMethod.POST)
		public void obtainAudio(@ModelAttribute("TTSContent") TTSContent content,HttpServletRequest request,HttpServletResponse response){
			PrintWriter out = null;
			out = AjaxPrintOut.getPrintWriterOut(response);
			String _webPath= "";
			String url = request.getRequestURL().toString();//return the request resource name
			 url = url.substring(0, url.indexOf("/web"));
			//TTSContent content = new TTSContent(params.get("processId").toString(),params.get("shapeId").toString(),params.get("contentValue").toString(),params.get("audioPath").toString());
			//If the content is null then return the empty value.
			if(content==null || StringUtils.isEmpty(content.getProcessId().trim()) || StringUtils.isEmpty(content.getShapeId().trim()) || StringUtils.isEmpty(content.getContent().trim())){
				out.print("EMPTY");
				return;
			}
			boolean audioOperResult =false;
			TTSContent _localContent = processInfoService.searchAudioPath(Integer.valueOf(content.getProcessId()), Integer.valueOf(content.getShapeId()));
			boolean invokeTTSService=false;
			if(_localContent!=null){
				if(content.getContent().equals(_localContent.getContent())){
					_webPath = _localContent.getAudioPath();
				}else{
					invokeTTSService = true;
				}
			}else{
				invokeTTSService = true;
			}
			if(invokeTTSService){
				//invoke TTS cloud services get the audio file save in the server and update the database 
				String strUrl=saveAudioFromTTSService(content,request);
				if(StringUtils.isEmpty(strUrl)){
					out.print("EMPTY");
				}else{
					   _webPath=url+AUDIO_FOLDER+"/"+content.getProcessId()+"/"+content.getShapeId()+".wav";
					 //add or update the audio path in the database
					   content.setAudioPath(_webPath);
					   if(_localContent==null){
						   //add the record
						   audioOperResult = processInfoService.addAudioPath(content);
					   }else{
						   //update the record
						   audioOperResult = processInfoService.updateAudioPath(content);
					   }
				}
			}
			
			if(audioOperResult){
				System.out.println(audioOperResult+"==========");
			}
			out.print(_webPath);
			out.flush();
			
			 
		}
		
		 
		
		/**
		 * save audio file on the server and return path
		 * @param TTSContent (generate the server path)
		 * @return
		 */
		private String saveAudioFromTTSService(TTSContent content,HttpServletRequest request){
			String folderPath = request.getSession().getServletContext().getRealPath(File.separator)+AUDIO_FOLDER+File.separatorChar+content.getProcessId();
			String filePath=folderPath+File.separatorChar+content.getShapeId()+".wav";
			
			PathMap targetURLMap = processInfoService.obtainValue("targetURL", "TTS");
			String targetURLF =  targetURLMap.getvContent();
			int endIndex = targetURLF.indexOf("/api");
			String firstPath = targetURLF.substring(0, endIndex);
			String secondPath=obtailURL(content.getContent());
			URL targetUrl;     
			 HttpURLConnection httpConnection = null;
			 FileOutputStream fosaudio=null;
			 try {
				targetUrl = new URL(firstPath+secondPath);
				httpConnection = (HttpURLConnection)targetUrl.openConnection();
				//build the connection with TTS service
		         httpConnection.connect();
		         //check the response
		         if(httpConnection.getResponseCode()!=200){
		        	 throw new RuntimeException("Failed : HTTP error code : "
		                        + httpConnection.getResponseCode());
		         }
		         //Check if the folder exist
		         File file =new File(folderPath);    
		       //If the folder not exist
		       if  (!file.exists()  && !file.isDirectory())      
		       {       
		           //create new folder
		           file.mkdirs();    
		       }
		         //Get the response stream data
		         InputStream is = httpConnection.getInputStream();
		         int output;
		         fosaudio =new FileOutputStream(filePath);
		         System.out.println("Output from Server:\n");
		         while ((output = is.read()) != -1) {
		        	 System.out.print(output);
		        	 fosaudio.write(output);
		         }        
		         fosaudio.flush(); 
		         fosaudio.close();
			 } catch (MalformedURLException e) {
				e.printStackTrace();
			 } catch (IOException e) {
				e.printStackTrace();
			 }finally{
				 //disconnection the connection 
				if(httpConnection!=null){
					httpConnection.disconnect();
				}
				//close the file
				if(fosaudio!=null){
					try {
						fosaudio.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			return filePath;
		}
		
		/**
		 * Get audio part URL from TTS service
		 * @param content
		 * @return generate part URL string
		 */
		private String obtailURL(String content){
			//URL parameter 
			String partURL="";
			//String _userKey = "KZVWMTKDKVMF6TKKK5EEOWSEIZHVSWKEIU4TSOK7GJYEKXZSHE4FCQK7IJMDIX2COFEA9999";
			//String _token = "GRXTA427GRXUWNC7KZYG2Y3WIVSV6NDPGBZV6TKKK5EEOWSEIZHVSWKEIU4TSOK7GRXUWNC7GJYEKXZUN4YHGXZSHE4FCQK7GRXUWNC7KZYFSSLWIVKV6NDPGBZV6Y3BMV4HMRKVL42G6MDTL42G6SZU";
			PathMap userKeyMap = processInfoService.obtainValue("userKey", "TTS");
			String _userKey =  userKeyMap.getvContent();
			PathMap tokenMap = processInfoService.obtainValue("token", "TTS");
			//String _token = "GRXTA427GRXUWNC7KZYG2Y3WIVSV6NDPGBZV6TKKK5EEOWSEIZHVSWKEIU4TSOK7GRXUWNC7GJYEKXZUN4YHGXZSHE4FCQK7GRXUWNC7KZYFSSLWIVKV6NDPGBZV6Y3BMV4HMRKVL42G6MDTL42G6SZU";
			String _token = tokenMap.getvContent();
			PathMap targetURLMap = processInfoService.obtainValue("targetURL", "TTS");
			String targetURLF =  targetURLMap.getvContent();
			//String targetURLF = "http://demo.icloud-radio.com/api/v3/"+_userKey+"/speech/tts?token="+_token+"&format=json";
			targetURLF.replace("[userKey]", _userKey);
			StringBuilder sb = new StringBuilder(targetURLF);
			sb.replace(targetURLF.indexOf('['), targetURLF.indexOf(']')+1, _userKey);
			String firstDoURL= sb.toString();
			StringBuilder ssb = new StringBuilder(firstDoURL);
			
			ssb.replace(firstDoURL.indexOf('['), firstDoURL.indexOf(']')+1, _token);
			targetURLF = ssb.toString();
			URL _targetUrl = null;
			HttpURLConnection httpConnection = null;
			 //Write the file
			 FileOutputStream fos =null;
			 OutputStream outputStream = null;
			 try {
				_targetUrl = new URL(targetURLF);
				httpConnection = (HttpURLConnection)_targetUrl.openConnection();
				//httpConnection.disconnect();
		        httpConnection.setRequestProperty("Content-Type", "application/json");
		        httpConnection.setDoOutput(true);
		        httpConnection.setDoInput(true);
		       httpConnection.connect();
		        /* Reference TTS guide document to match the request JSON parameter 
		         “type”: “TTSText”,
		     	“contentFormat”: “xxx”,
		     	“content”: “xxx”,s
		     	“firstPackage”: true/false,
		     	“lastPackage”: true/false,
		     	“returnFormat”: “JSON”,
		     	“returnEncoding”: “xxx”,
		     	"eventData":{
		     		“textformat”: “xxx”,
		     		“locale”: “xxx”,
		     		“persona”: “xxx”,
		     		“text”: “xxx”
		     	} */
		         String _inputJSONData = "{\"type\":\"TTSText\",\"contentFormat\":\"plain\",\"content\":\""+content+
		        		 "\",\"firstPackage\":true,\"lastPackage\":true,\"returnFormat\":\"JSON\",\"returnEncoding\":\"WAV\""
		        		 + ",\"eventData\":{\"textformat\":\"plain\",\"locale\":\"en_us\",\"persona\":\"BLS\",\"text\":\""+content+"\"}}";
		         outputStream = httpConnection.getOutputStream();
	             outputStream.write(_inputJSONData.getBytes());
	             outputStream.flush();
	             outputStream.close();
	         
	             //Response information 
	             java.io.BufferedReader responseBuffer=new BufferedReader(new InputStreamReader(httpConnection.getInputStream()));
	             //Print in the server console first in testing phase
	             String output;
	             
	             System.out.println("Output from Server:\n");
	             while ((output = responseBuffer.readLine()) != null) {
	               System.out.println(output); 
	               JSONObject jsonObject = new JSONObject(output);
	               partURL=String.valueOf(jsonObject.get("url"));
	               if(!StringUtils.isEmpty(partURL.trim())){
	            	   break;
	               }
	             }
			} catch (MalformedURLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}finally{
				if(fos!=null){
					try {
						fos.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
				if(outputStream!=null){
					try {
						outputStream.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if(httpConnection!=null){
					httpConnection.disconnect();
				}
			}
			return partURL; 
		}
		
		private String demoObtailURL(String content){
			String output="{'statusCode':'03031000','content':'Hello world','contentFormat':'String','type':'TTSAudio','eventData':{'sessionID':'A7E010180A0A5AAEFA413BE12660992D281EA303CFDAC9BABC61F74224FD5A4F','source':'TTS','events':[{'value':{'lastpackage':true,'errordescription':null,'status':'succeed','locale':'en_US','encoding':'wav','errorcode':20200},'type':'Result_TTS'}],'eventtypes':['Result_TTS'],'domain':'unknown','seqID':-1,'userkey':'KZVWMTKDKVMF6TKKK5EEOWSEIZHVSWKEIU4TSOK7GJYEKXZSHE4FCQK7IJMDIX2COFEA9999','destination':'DS'},'url':'/fl-live/10154/177201/37072631/37072632/1.wav','statusMessage':'Success'}";
			 JSONObject jsonObject = new JSONObject(output);
             String partURL=String.valueOf(jsonObject.get("url"));
             return partURL;
             
		}
		
		
		

}
