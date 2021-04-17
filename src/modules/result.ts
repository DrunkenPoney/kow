import { reactive } from 'vue'

export type VoteValues = {
  VERY_HIGH: number,
  HIGH: number,
  MEDIUM: number,
  LOW: number,
  VERY_LOW: number
}

type Stats = {
  count: number,
  rating: number,
  favorable: number,
  neutral: number
  defavorable: number
}


export interface IResult {
  readonly member: string
  readonly vote: VoteValues
  readonly stats: Stats
  
  add(vote: keyof VoteValues): this
}

const dfltVoteValues: VoteValues = {
  VERY_HIGH: 1,
  HIGH: 0.5,
  MEDIUM: 0,
  LOW: -0.5,
  VERY_LOW: -1,
}

export class Result implements IResult {
  static readonly voteValues: VoteValues = reactive(dfltVoteValues)
  readonly vote: VoteValues
  readonly member: string
  
  constructor(member: string) {
    this.vote   = { VERY_HIGH: 0, HIGH: 0, MEDIUM: 0, LOW: 0, VERY_LOW: 0 }
    this.member = member
  }
  
  get stats(): Stats {
    let stats: Stats = { count: 0, rating: 0, neutral: 0, favorable: 0, defavorable: 0 }
    let value: number
    for (let [ key, vote ] of Object.entries(this.vote)) {
      value = Result.voteValues[key as keyof VoteValues]
      stats.count += vote
      stats[value < 0 ? 'defavorable' : value > 0 ? 'favorable' : 'neutral'] += vote
      stats.rating += vote * value
    }
    stats.rating /= stats.count
    stats.neutral /= stats.count
    stats.favorable /= stats.count
    stats.defavorable /= stats.count
    return stats
  }
  
  add(vote: keyof VoteValues): this {
    this.vote[vote]++
    return this
  }
}


export interface IResultArray extends Array<IResult> {
  get(member: string): IResult | undefined
}

export class ResultArray extends Array<IResult> implements IResultArray {
  get(member: string): IResult | undefined {
    return this.find((res) => res.member === member)
  }
}