enum AgeGroup {
  CHILDREN = '0-13',
  ADOLESCENT = '14-19',
  TWENTIES = '20-29',
  THIRTIES = '30-39',
  FORTIES = '40-49',
  FIFTIES = '50-59',
  OVER_SIXTIES = '60-',
  UNDEFINED = '정의 안 함'
}

type AgeGroupKey = keyof typeof AgeGroup;

export { AgeGroup, AgeGroupKey };
