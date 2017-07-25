package com.bosch.dstools.bls.utils;

public enum SectionStatusEnum {
	NOR(1),//Normal 
	BIND(2),//Binding
	UNFINISHED(3),//Unfinished
	FAIL(4);//Failed
	
	private int value;
	private SectionStatusEnum(int value){
		this.value=value;
	}
	public int getValue() {
		return value;
	}
	public void setValue(int value) {
		this.value = value;
	}
	
}
