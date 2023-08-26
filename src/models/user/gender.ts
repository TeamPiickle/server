enum Gender {
  MALE = '남',
  FEMALE = '여',
  ETC = '기타'
}

type GenderKey = keyof typeof Gender;

export { Gender, GenderKey };
