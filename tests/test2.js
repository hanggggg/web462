
function solution(S) {
	var t=0
	var dic = new Array()
	let set = new Set([])
	var d=0
	for(i=0;i<S.length;i++){
		var t=0
		if((dic.hasOwnProperty(S[i]))===true){
			continue
		}else
		for(j=i;j<S.length;j++){
			
			if(S[i]==S[j]){
				t++	
			}
			var key=S[i]
			dic[S[i]]=t
			
		}
		if((set.has(dic[S[i]])!=true)){
			
		   set.add(dic[S[i]])	
		}else
		for(j=dic[S[i]];j>0;j--){
			
			d=d+1
			if(set.has(j-1)!=true){
				set.add(j-1)
				
				break
			}
		}
	}
    return d// write your code in JavaScript (Node.js 8.9.4)
}

console.log(solution("aaaabbbbcccddef"))
console.log(solution("eddcccbbbbaaaa"))
console.log(solution("abcdabcdabcd"))


