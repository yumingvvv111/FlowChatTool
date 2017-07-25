package com.bosch.dstools.bls.utils;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

public class AjaxPrintOut {
	/**
	 * 
	 * @param response
	 * @return
	 */
	public static PrintWriter getPrintWriterOut(HttpServletResponse response){
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
