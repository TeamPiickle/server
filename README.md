# Project

> 지금 내게 필요한 대화주제 추천 서비스, Piickle

# 🛠 개발 환경

![img](https://img.shields.io/badge/typescript-4.6.3-blue)
![img](https://img.shields.io/badge/ts--node-10.7.0-green)
![img](https://img.shields.io/badge/Mongoose-5.13.2-yellowgreen)
![img](https://img.shields.io/badge/Express-v4.18.1-green)


# 📧API 명세서

[API 명세서 링크](https://joyous-ghost-8c7.notion.site/API-a2efdef81ae34b9c98bcf0d96cd5dd4f)

# 📋 Model Diagram
![image](https://user-images.githubusercontent.com/80771842/178112388-8ce96330-cae2-4169-b6de-7e66e4dac70f.png)


# ✉️ Commit Messge Rules

**서버** 들의 **Git Commit Message Rules**

- 반영사항을 바로 확인할 수 있도록 작은 기능 하나라도 구현되면 커밋을 권장합니다.
- 기능 구현이 완벽하지 않을 땐, 각자 브랜치에 커밋을 해주세요.

### 📌 Commit Convention

**[태그] 제목의 형태**

| 태그 이름| 설명 |
| :--: | :-----: |
| feat | 새로운 기능을 추가할 경우 |
| fix | 버그를 고친 경우 |
| chore | 짜잘한 수정 |
| docs | 문서 수정 |
| init | 초기 설정 |
| test | 테스트 코드, 리펙토링 테스트 코드 추가 |
| rename | 파일 혹은 폴더명을 수정하거나 옮기는 작업인 경우 |
| style | 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우 |
| refactor | 코드 리팩토링 |

### **커밋 타입**

- `[태그] 설명` 형식으로 커밋 메시지를 작성합니다.
- 태그는 영어를 쓰고 대문자로 작성합니다.

예시 >

```
  [FEAT] 검색 api 추가
```


## **💻 Github mangement**

**서버** 들의 WorkFlow : **Gitflow Workflow**

- Develop, Feature, Hotfix 브랜치
  
  
  개발(develop): 기능들의 통합 브랜치  
  
  기능 단위 개발(feature): 기능 단위 브랜치
  
  버그 수정 및 갑작스런 수정(hotfix): 수정 사항 발생 시 브랜치

  개발 브랜치 아래 기능별 브랜치를 만들어 작성합니다. 
   
- Gitflow 규칙
  - Develop에 직접적인 commit, push는 금지합니다. 
  - 커밋 메세지는 다른 사람들이 봐도 이해할 수 있게 써주세요.
  - 풀리퀘스트를 통해 코드 리뷰를 전원이 코드리뷰를 진행합니다.
  - 기능 개발 시 개발 브랜치에서 feat/기능 으로 브랜치를 파서 관리합니다.
  - feat은 자세한 기능 한 가지를 담당하며, 기능 개발이 완료되면 각자의 브랜치로 Pull Request를 보냅니다. 
  - 각자가 기간 동안 맡은 역할을 전부 수행하면, 각자 브랜치에서 develop브랜치로 Pull Request를 보냅니다.  
  **develop 브랜치로의 Pull Request는 상대방의 코드리뷰 후에 merge할 수 있습니다.**

## 📋 Code Review Convention

- P1: 꼭 반영해주세요 (Request changes)
- P2: 적극적으로 고려해주세요 (Request changes)
- P3: 웬만하면 반영해 주세요 (Comment)
- P4: 반영해도 좋고 넘어가도 좋습니다 (Approve)
- P5: 그냥 사소한 의견입니다 (Approve)

- D-0 (ASAP)

긴급한 수정사항으로 바로 리뷰해 주세요. 앱의 오류로 인해 장애가 발생하거나, 빌드가 되지 않는 등 긴급 이슈가 발생할 때 사용합니다.

- D-N (Within N days)

“Working Day 기준으로 N일 이내에 리뷰해 주세요”

### 🙋🏻‍♀️ 담당
<details>
<summary>DB 설계</summary>
<div markdown="1">  
 
| 기능명 | 담당자 | 완료 여부 |
| :-----: | :---: | :---: |
 
</div>
</details>

<details>
<summary>api 구현</summary>
<div markdown="1">  

| 기능명 | 담당자 | 완료 여부 |
| :-----: | :---: | :---: |

</div>
</details>

# Developers
| 윤가영 | 이동현 | 최승빈 |
