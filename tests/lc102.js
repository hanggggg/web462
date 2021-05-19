
 function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
 }

// *
//  * @param {TreeNode} root
//  * @return {number[][]}


var levelOrder = function(root) {

  if(root === null || root.length === 0){
    return [];
  }
    //创建队列并把起始节点入队(第一层)
    let queue = [], result = []
    queue.push(root)
    while(queue.length !== 0) {
      //从上一层节点拓展到下一层
      let level = []  //保存当前层过结果
      let size = queue.length
      for(let i = 0; i < size; i++) {
        node = queue.shift()
        level.push(node.val)
        if(node.left) {
          queue.push(node.left)
        }
        if(node.right) {
          queue.push(node.right)
        }
      }
      result.push(level)
    }
    return result
};


console.log(levelOrder([3,9,20,null,null,15,7]))