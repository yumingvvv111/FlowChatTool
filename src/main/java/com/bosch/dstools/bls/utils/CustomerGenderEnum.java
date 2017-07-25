package com.bosch.dstools.bls.utils;

public enum CustomerGenderEnum {
	MALE(1),//Male 
	FEMALE(2),//Female
	CONFIDENTIAL(0);//Confidential
	
	private int value;
	private CustomerGenderEnum(int value){
		this.value=value;
	}
	public int getValue() {
		return value;
	}
	public void setValue(int value) {
		this.value = value;
	}
	
}
