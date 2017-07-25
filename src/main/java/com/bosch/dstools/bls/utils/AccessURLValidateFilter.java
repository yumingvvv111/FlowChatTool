package com.bosch.dstools.bls.utils;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

public class AccessURLValidateFilter extends OncePerRequestFilter {
	private String IgnoreURL;
	@Override
	protected void doFilterInternal(HttpServletRequest request,
			HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		String requestURL= request.getRequestURI();
		boolean isFilter=true;
		String[] ignoreURLArr=IgnoreURL.split(":");
		for (String ignoreU:ignoreURLArr){
			if(requestURL.indexOf(ignoreU)!=-1){
				isFilter=false;
				break;
			}
		}
		Object curUser = request.getSession().getAttribute("customerInfo");
		
		if(curUser!=null||!isFilter){
			filterChain.doFilter(request, response);
		}else{
			request.getRequestDispatcher("/web/customerController/loginPage").forward(request, response);
		}
	}
	public String getIgnoreURL() {
		return IgnoreURL;
	}
	public void setIgnoreURL(String ignoreURL) {
		IgnoreURL = ignoreURL;
	}
	
}
