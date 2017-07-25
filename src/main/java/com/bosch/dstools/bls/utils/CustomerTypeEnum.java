package com.bosch.dstools.bls.utils;

public enum CustomerTypeEnum {
	ADM(2),//Administrator 
	DEVE(1);//Developer
	private int value;
	private CustomerTypeEnum(int value){
		this.value=value;
	}
	public int getValue() {
		return value;
	}
	public void setValue(int value) {
		this.value = value;
	}
	
}
