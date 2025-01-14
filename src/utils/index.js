import moment from "moment"
import _ from "lodash"

/**
 * Create poltician profile image URL
 * @param {People} profile
 */
export function politicianPicture(profile) {
  if (!profile.name || !profile.lastname) return ""
  return `https://elect.thematter.co/data/politicians/${profile.name}-${profile.lastname}.jpg`
}
/**
 * Create poltician profile image URL
 * @param {People} profile
 */
export function partyLogo(partyName) {
  return `https://elect.in.th/candidates/statics/party-logos/${partyName}.png`
}

/**
 * Calcaulate person's age from his/her birthdaty
 * @param {String, Date} birthdate Date format accepted by moment
 */
export function ageFromBirthdate(birthdate) {
  return moment().diff(moment(birthdate), "years")
}

/**
 * For fun. Change arabic number to Thai reading
 * @param {Number} number
 */
export function getThaiName(number) {
  const mapping = d => {
    switch (d) {
      case "0":
        return "ศูนย์"
      case "1":
        return "หนึ่ง"
      case "2":
        return "สอง"
      case "3":
        return "สาม"
      case "4":
        return "สี่"
      case "5":
        return "ห้า"
      case "6":
        return "หก"
      case "7":
        return "เจ็ด"
      case "8":
        return "แปด"
      case "9":
        return "เก้า"
      default:
        return "ว่าง"
    }
  }
  const digits = String(number)
  return _.map(digits, d => mapping(d)).join("")
}

export function float2Grey(x) {
  x = 1 - x
  x = parseInt(x * 15)
  x = x.toString(16)
  return "#" + x + x + x
}

export function calculateBackground(input) {
  let count = input.length - 1
  input.map((x, idx) => {
    x.background = float2Grey(idx / count)
  })
  return input
}

export function combineCategory(input) {
  input.sort((a, b) => parseInt(b.value) - parseInt(a.value))
  let temp = []
  let count_others = 0
  input.map((x, idx) => {
    if (idx > 2) {
      count_others += x.value
    } else {
      temp.push(x)
    }
    return x
  })
  temp[temp.length] = { value: count_others, name: "อื่นๆ" }
  input = temp
  return input
}

export function padCategory(input) {
  input.map(x => {
    if (x.name.length === 0) {
      x.name = "ไม่พบข้อมูล"
    }
    return x
  })
  return input
}

export function birthdayToAgeHistogram (birthdate, ageBin) {
  let age = []
  age.push({ name: String("25-" + String(ageBin[0] - 1)) + " ปี", value: 0 })
  age.push({
    name: String(ageBin[0]) + "-" + String(ageBin[1] - 1) + " ปี",
    value: 0,
  })
  age.push({
    name: String(ageBin[1]) + "-" + String(ageBin[2] - 1) + " ปี",
    value: 0,
  })
  age.push({ name: String(">" + ageBin[2]) + " ปี", value: 0 })
  const today = parseInt(moment().format("YYYY"))
  birthdate.map(x => {
    const y = parseInt(moment(x.node.birthdate).format("YYYY"))
    const a = today - y
    if (a < ageBin[0]) {
      age[0].value++
    } else if (a < ageBin[1]) {
      age[1].value++
    } else if (a < ageBin[2]) {
      age[2].value++
    } else {
      age[3].value++
    }
    return x
  })
  return age
}