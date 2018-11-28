import math from 'mathjs';

const eMax = math.bignumber('0.9999'); // 最大概率/瞬时价格
const eMin = math.bignumber('0.0001'); // 最小成本

function expSumBigNum(array, lossLimit) {
  let expSum = math.bignumber(0);
  array.forEach(val => {
    const vol = math.bignumber(val.volume);
    expSum = math.add(expSum, math.exp(math.divide(vol, lossLimit)));
  });
  return expSum;
}

function costCurrentBigNum(array, lossLimit) {
  const expSum = expSumBigNum(array, lossLimit);
  return math.multiply(lossLimit, math.log(expSum));
}

export function costEstimator(arr1, arr2, lossLimit) {
  // lsmr calculation process code goes here
  const N = arr1.length;
  if (N != arr2.length) return null;

  lossLimit = math.bignumber(lossLimit);
  const cost = math.subtract(
    costCurrentBigNum(arr2, lossLimit),
    costCurrentBigNum(arr1, lossLimit),
  );
  return parseFloat(cost.toString());
}

function expSumExcepti(array, index, lossLimit) {
  let expSum = math.bignumber(0);
  for (let j = 0; j < array.length; j++) {
    const i = array[j];
    if (i != index) {
      const vol = math.bignumber(array[i].volume);
      expSum = math.add(expSum, math.exp(math.divide(vol, lossLimit))); // e^(qi/l)
    }
  }
  return expSum;
}

function getPreProbShare(array, index, prob, lossLimit) {
  // 获取结果index的预定概率股份
  // prob = math.bignumber(prob);
  lossLimit = math.bignumber(lossLimit);

  const expSumExceptIndex = expSumExcepti(array, index, lossLimit);
  const one = math.bignumber(1);
  const oneSubprob = math.subtract(one, prob);
  let maxShare = math.multiply(expSumExceptIndex, math.divide(prob, oneSubprob));
  maxShare = math.multiply(lossLimit, math.log(maxShare));
  const curSharei = math.bignumber(array[index].volume);
  maxShare = math.subtract(maxShare, curSharei);
  return parseFloat(maxShare.toString());
}
export function getMaxShare(array, index, lossLimit) {
  // 获取结果index的动态最大股份
  return getPreProbShare(array, index, eMax, lossLimit);
}
export function getInstantPrice(array, index, lossLimit) {
  // 获取结果index的当前瞬时价格
  lossLimit = math.bignumber(lossLimit);
  const expSum = expSumBigNum(array, lossLimit);
  const curSharei = math.bignumber(array[index].volume);
  let instantPrice = math.exp(math.divide(curSharei, lossLimit));
  instantPrice = math.divide(instantPrice, expSum);
  return parseFloat(instantPrice.toString());
}

// 极端情况，当index结果的瞬时价格很小时，导致购买1份的index的价格小于10^(-18),没有意义，这里设置价格最小为0.0001时对应必须购买的最小股份数
// usage: getMinShareForeMin>1 时使用该最小股份，否则最小股份仍为1
function getMinShareForeMin(array, index, lossLimit) {
  let minShare = math.add(eMin, costCurrentBigNum(array, lossLimit));
  minShare = math.divide(minShare, lossLimit);
  minShare = math.exp(minShare);
  minShare = math.subtract(minShare, expSumExcepti(array, index, lossLimit));
  minShare = math.multiply(lossLimit, math.log(minShare));
  const curSharei = math.bignumber(array[index].volume);
  minShare = math.subtract(minShare, curSharei);
  return parseFloat(minShare.toString());
}

export function getMinShare(array, index, lossLimit) {
  // 获取结果index的最小购买股份，极端情况不为1
  let getMin = getMinShareForeMin(array, index, lossLimit);
  if (getMin < 1) getMin = 1;
  return Math.ceil(getMin);
}
