function solution(S) {
    // write your code in JavaScript (Node.js 8.9.4)
	var p=0,f=0
	var big="@"
	for(i=0;i<S.length;i++){
		
		
		if(S[i].charCodeAt(0)>96){
			for(j=0;j<S.length;j++){
				if((S[i].charCodeAt(0)-32)==S[j].charCodeAt(0)){
					
					p=1
					
					if((S[i].charCodeAt(0)-32)>(big.charCodeAt(0))){
						big=S[j]
					}	
				}				
			}
			
		}
		
		f=p+p
	}
	if(f<1){
		return "NO"
	}
	else{
		return big
	}
}

console.log(solution("DADasda"))
