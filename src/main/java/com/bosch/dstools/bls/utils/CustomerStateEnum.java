package com.bosch.dstools.bls.utils;

public enum CustomerStateEnum {
	REG(0),//Register 
	AUTH(1),//Authenticated
	FREE(2);//Freeze
	
	private int value;
	private CustomerStateEnum(int value){
		this.value=value;
	}
	public int getValue() {
		return value;
	}
	public void setValue(int value) {
		this.value = value;
	}
	
}
