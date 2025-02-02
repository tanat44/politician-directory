import React, { useState } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PeopleCard from "../components/peopleCard"
import PeopleCardMini from "../components/peopleCardMini";
import './cabinet.css'
import { calculateBackground, combineCategory, padCategory, birthdayToAgeHistogram } from "../utils"
import StackedBarChart from "../components/stackedBarChart"

export const query = graphql`
  query {
    allPeopleYaml(filter: { is_senator: { eq: true } }) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          title
          name
          lastname
          senator_method
        }
      }
    }
    gender: allPeopleYaml(filter: { is_senator: { eq: true } }) {
      group(field: gender) {
        value: totalCount
        name: fieldValue
      }
    }
    education: allPeopleYaml(filter: { is_senator: { eq: true } }) {
      group(field: education) {
        value: totalCount
        name: fieldValue
      }
    }
    occupation_group: allPeopleYaml(filter: { is_senator: { eq: true } }) {
      group(field: occupation_group) {
        value: totalCount
        name: fieldValue
      }
    }
    age: allPeopleYaml(filter: { is_senator: { eq: true } }) {
      edges {
        node {
          birthdate
        }
      }
    }
    keyMembers: allPeopleYaml(filter: {id: {in: ["644","737","707"]}}) {
      edges {
        node {
          id
          title
          name
          lastname
          party
          party_group
          mp_type
          mp_province
          mp_zone
          mp_list
        }
      }
    }
  }
`

const cssH1 = { fontSize: "4.8rem" }

const cssSection = {
  paddingTop: "3rem",
  paddingBottom: "8rem",
  h2: {
    fontSize: "4.8rem",
    textAlign: "center",
  },
}

const cssEngTitle = {
  fontSize: "2.4rem",
  textAlign: "left",
  margin: "1.5rem 0 1.2rem 0",
}

const cssPageP = {
  fontSize: "1.7rem",
}

const cssBarChart = {
  margin: "1rem 0",
}

const cssLinkBox = {
  fontSize: "1.7rem",
  fontFamily: "var(--ff-title)",
  fontWeight: "bold",
  border: "1px solid var(--cl-black)",
  marginRight: "1rem",
  padding: "0 1rem",
  textDecoration: "none",
  color: "var(--cl-black)",
  "&:hover": {
    textDecoration: "none",
  },
}


const SenatePage = ({ data }) => {
  const [memberFilter, setMemberFilter] = useState({})
  const [members] = useState(data.allPeopleYaml.edges.map(e => e.node))
  const selectMemberFilter = filter => () => setMemberFilter(filter)

  const getSortedMembers = () => {
    // filter member by senator_method
    let selectedMembers = members.filter(
      member =>
        !memberFilter.senator_method ||
        member.senator_method === memberFilter.senator_method
    )
    // sort by name and lastname
    selectedMembers.sort((a, b) =>
      a.name === b.name
        ? a.lastname.localeCompare(b.name, "th")
        : a.name.localeCompare(b.name, "th")
    )
    return selectedMembers
  }

  let education = data.education.group
  education = calculateBackground(education)

  let occupation_group = data.occupation_group.group
  occupation_group = padCategory(occupation_group)
  occupation_group = combineCategory(occupation_group)
  occupation_group = calculateBackground(occupation_group)

  let gender = data.gender.group
  gender = calculateBackground(gender)

  let birthdate = data.age.edges
  const ageBin = [39, 52, 65]
  let age = birthdayToAgeHistogram(birthdate, ageBin)
  age = calculateBackground(age)

  let keyMembers = data.keyMembers.edges
  const newOrder = [0,2,1]
  keyMembers = newOrder.map(i => keyMembers[i])
  let keyPosition = ['ประธาน', 'รองประธานคนที่ 1', 'รองประธานคนที่ 2']
  let k = []
  keyMembers.map( (x, idx) => {
    let aPerson = x.node
    aPerson.pos = keyPosition[idx]
    k.push(aPerson)
    return x
  })
  keyMembers = k

  return (
    <Layout>
      <SEO title="สมาชิกวุฒิสภา" />
      <section className="section" css={{ background: "#EDF087" }}>
      <div className="book">
          <div className="page leftPage">
            <h1 css={{ ...cssH1, margin: "1rem 0 0 0"}}>สมาชิกวุฒิสภา</h1>
            <h2 style={{ ...cssEngTitle }}>Senate</h2>
            <h2 style={{ ...cssEngTitle }}>About</h2>
            <p style={{ ...cssPageP }}>
            เป็นคณะบุคคลที่ทำหน้าที่บริหารราชการแผ่นดิน โดย ครม. ชุดนี้ เกิดจากการนำของพรรคพลังประชารัฐ ร่วมกับพรรคการเมืองอีก 19 พรรคเสนอชื่อพลเอก ประยุทธ์ จันทร์โอชา ซึ่งเคยดำรงตำแหน่งนายกฯ และหัวหน้าคสช. มาเป็นเวลา 5 ปี เป็นนายกรัฐมนตรีต่ออีกสมัย ทำให้ ครม. ชุดนี้มีอีกชื่อเรียกว่าคณะรัฐมนตรีประยุทธ์ 2
            </p>
            <h2 style={{ ...cssEngTitle }}>Official Website</h2>
            <div style={{ display: "block" }}>
              <a css={{ ...cssLinkBox }} href="https://www.thaigov.go.th/">
                Website
              </a>
              <a
                css={{ ...cssLinkBox }}
                href="https://www.facebook.com/%E0%B8%AA%E0%B8%B3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B8%93%E0%B8%B0%E0%B8%A3%E0%B8%B1%E0%B8%90%E0%B8%A1%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%B5-136289490069836/"
              >
                Facebook
              </a>
            </div>
            <h2 style={{ ...cssEngTitle }}>Since</h2>
            <p>01.04.2554</p>
            <h2 style={{ ...cssEngTitle }}>Key Members</h2>
            {keyMembers.map(x => {
              return (
                <div className="peopleCard" key={x.id}>
                  <PeopleCardMini key={x.id} {...x}/>
                </div>
              )
            })}
          </div>
          <div className="page">
            <h2
              style={{
                ...cssEngTitle,
                marginTop: "3.5rem",
                marginBottom: "0rem",
              }}
            >
              Members
            </h2>
            <h2
              style={{
                ...cssEngTitle,
                fontFamily: "var(--ff-text)",
                fontWeight: "normal",
              }}
            >
              จำนวนสมาชิกวุฒิสภา 500 คน
            </h2>
            <div css={{ width: "100%" }}>
              <div style={{ ...cssBarChart }}>
                <StackedBarChart data={gender}></StackedBarChart>
              </div>
              <div style={{ ...cssBarChart }}>
                <StackedBarChart data={age}></StackedBarChart>
              </div>
              <div style={{ ...cssBarChart }}>
                <StackedBarChart data={education}></StackedBarChart>
              </div>
              <div style={{ ...cssBarChart }}>
                <StackedBarChart data={occupation_group}></StackedBarChart>
              </div>
            </div>
          </div>
        </div>
        <h2 className="lastUpdate">
          Last Update: 30.10.2019
        </h2>
      </section>
      <section css={{ ...cssSection, background: "var(--cl-white)" }}>
        <div className="container">
          <h2 css={{ ...cssH1 }}>สรุปการลงมติล่าสุด</h2>
        </div>
      </section>
      <section css={{ ...cssSection, background: "#eeeeee" }}>
        <div className="container">
          <h2
            css={{
              fontSize: "4.8rem",
              textAlign: "center",
              paddingTop: "6rem",
            }}
          >
            สมาชิกทั้งหมด
          </h2>
          <ul
            css={{
              display: "block",
              listStyle: "none",
              textAlign: "center",
              "> li": {
                display: "inline-block",
                fontSize: "3.2rem",
                padding: "1rem 2rem",
                cursor: "pointer",
                "&.active": {
                  borderBottom: "8px solid var(--cl-black)",
                },
              },
            }}
          >
            <li
              className={[!memberFilter.senator_method ? "active" : ""].join(
                " "
              )}
              role="tab"
              onClick={selectMemberFilter({})}
            >
              ทั้งหมด
            </li>
            <li
              className={[
                memberFilter.senator_method === "โดยตำแหน่ง" ? "active" : "",
              ].join(" ")}
              role="tab"
              onClick={() => {
                setMemberFilter({ senator_method: "โดยตำแหน่ง" })
              }}
            >
              โดยตำแหน่ง
            </li>
            <li
              className={[
                memberFilter.senator_method === "เลือกกันเอง" ? "active" : "",
              ].join(" ")}
              role="tab"
              onClick={selectMemberFilter({ senator_method: "เลือกกันเอง" })}
            >
              สรรหา
            </li>
            <li
              className={[
                memberFilter.senator_method === "เลือกโดย คสช." ? "active" : "",
              ].join(" ")}
              role="tab"
              onClick={selectMemberFilter({ senator_method: "เลือกโดย คสช." })}
            >
              เลือกโดย คสช.
            </li>
          </ul>
          <div
            css={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
            }}
          >
            {getSortedMembers().map((member, index) => (
              <PeopleCard
                key={member.id}
                {...member}
                type="senator"
              ></PeopleCard>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default SenatePage
