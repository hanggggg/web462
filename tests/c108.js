
var i=1
function TreeNode(val, left, right) {
	

	console.log("val="+val)
	console.log("left="+left)
	console.log("right="+right)
	console.log("")
	
     this.val = (val===undefined ? 0 : val)
     this.left = (left===undefined ? null : left)
     this.right = (right===undefined ? null : right)
}

var sortedArrayToBST = function(nums) {
	

  var buildBST = function(l, r) {    

	console.log("roud:"+i)
	console.log("l:"+l)
	console.log("r:"+r)
	i=i+1
    if (l > r) {console.log("return null");
				console.log("")
				return null;
				
	};
    let m = l + Math.floor((r - l) / 2);
	console.log("m="+m)
	console.log("nums[m]="+nums[m])
    let root = new TreeNode(nums[m]);
	console.log("root="+nums[m])
    root.left = buildBST(l, m - 1);
    root.right = buildBST(m + 1, r);
    console.log("return root"+root)
	  
    return root;
  }
  return buildBST(0, nums.length - 1);
};

console.log(sortedArrayToBST([-10,-3,-1,0,1,5,9]))