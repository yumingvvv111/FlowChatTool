package com.bosch.dstools.bls.utils;

public enum ProcessStatusEnum {
	EDIT(1),//Editor 
	RUN(2),//Running
	BLOCK(3),//Block
	DISABLED(4);//Disabled
	
	private int value;
	private ProcessStatusEnum(int value){
		this.value=value;
	}
	public int getValue() {
		return value;
	}
	public void setValue(int value) {
		this.value = value;
	}
	
}
