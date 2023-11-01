import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: 'web2_proj1',
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true
})

export type Competition = {
    id : number,
    name : string,
    winPoints : number,
    drawPoints : number,
    losePoints : number,
    creator? : string
};

export type Team = {
    id : number,
    name : string
};

export type CompetitionTeam = {
    competitionId : number,
    competitionName : string,
    teamId : number,
    teamName : string,
    wins? : number,
    draws? : number,
    loses? : number,
    points? : number
};

export type Match = {
    id : number,
    competitionId : number,
    competitionName : string,
    firstTeamId : number,
    firstTeamName : string,
    secondTeamId : number,
    secondTeamName : string,
    matchTime : string,
    firstTeamScore? : number,
    secondTeamScore? : number,
    round : number,
};

export async function getCompetitions() : Promise<Competition[]> {
    const competitions : Competition[] = []
    const result = await pool.query('SELECT id, name, win_points, draw_points, lose_points, creator FROM competition');
    result.rows.forEach(r => {
        competitions.push({id: parseInt(r['id']),
                        name: r['name'],
                        winPoints: parseFloat(r['win_points']),
                        drawPoints: parseFloat(r['draw_points']),
                        losePoints: parseFloat(r['lose_points']),
                        creator: r['creator']
                    });
    })
    return competitions;
}

export async function getCompetitionsByCreator(creator : string) : Promise<Competition[]> {
    const competitions : Competition[] = []
    const result = await pool.query('SELECT id, name, win_points, draw_points, lose_points FROM competition WHERE creator = $1', [creator]);
    result.rows.forEach(r => {
        competitions.push({id: parseInt(r['id']),
                        name: r['name'],
                        winPoints: parseFloat(r['win_points']),
                        drawPoints: parseFloat(r['draw_points']),
                        losePoints: parseFloat(r['lose_points'])
                    });
    })
    return competitions;
}

export async function getCompetitionById(id : number) : Promise<Competition> {
    const competitions : Competition[] = []
    const result = await pool.query('SELECT id, name, win_points, draw_points, lose_points, creator FROM competition WHERE id = $1', [id]);
    result.rows.forEach(r => {
        competitions.push({id: parseInt(r['id']),
                        name: r['name'],
                        winPoints: parseFloat(r['win_points']),
                        drawPoints: parseFloat(r['draw_points']),
                        losePoints: parseFloat(r['lose_points']),
                        creator: r['creator']
                    });
    })
    return competitions[0];
}

export async function getCompetitionByName(name : string) : Promise<Competition> {
    const competitions : Competition[] = []
    const result = await pool.query('SELECT id, name, win_points, draw_points, lose_points, creator FROM competition WHERE name = $1', [name]);
    result.rows.forEach(r => {
        competitions.push({id: parseInt(r['id']),
                        name: r['name'],
                        winPoints: parseFloat(r['win_points']),
                        drawPoints: parseFloat(r['draw_points']),
                        losePoints: parseFloat(r['lose_points']),
                        creator: r['creator']
                    });
    })
    return competitions[0];
}

export async function getTeams() : Promise<Team[]> {
    const teams : Team[] = []
    const result = await pool.query('SELECT id, name FROM team');
    result.rows.forEach(r => {
        teams.push({id: parseInt(r['id']),
                    name: r['name']});
    })
    return teams;
}

export async function getTeamByName(name : string) : Promise<Team[]> {
    const teams : Team[] = []
    const result = await pool.query('SELECT id, name FROM team WHERE name = $1', [name]);
    result.rows.forEach(r => {
        teams.push({id: parseInt(r['id']),
                    name: r['name']});
    })
    return teams;
}

export async function getCompetitionTeams() : Promise<CompetitionTeam[]> {
    const competitionTeams : CompetitionTeam[] = []
    const result = await pool.query(`SELECT competition.id competition_id, competition.name competition_name, wins, draws, loses, points, team.id team_id, team.name team_name
                                        FROM competition
                                        INNER JOIN competition_team
                                            ON competition_id = competition.id
                                        INNER JOIN team
                                            ON team.id = team_id
                                        ORDER BY points`);
    result.rows.forEach(r => {
        competitionTeams.push({competitionId: parseInt(r['competition_id']),
                            competitionName : r['competition_name'],
                            teamId: parseInt(r['team_id']),
                            teamName: r['team_name'],
                            wins: parseInt(r['wins']),
                            draws: parseInt(r['draws']),
                            loses: parseInt(r['loses']),
                            points: parseInt(r['points'])
                    });
    })
    return competitionTeams;
}

export async function getCompetitionTeamsById(competitionId : number) : Promise<CompetitionTeam[]> {
    const competitionTeams : CompetitionTeam[] = []
    const result = await pool.query(`SELECT competition.id competition_id, competition.name competition_name, wins, draws, loses, points, team.id team_id, team.name team_name
                                        FROM competition
                                        INNER JOIN competition_team
                                            ON competition_id = competition.id
                                        INNER JOIN team
                                            ON team.id = team_id
                                        WHERE competition.id = $1
                                        ORDER BY points DESC, wins DESC, draws DESC, loses DESC, team.name`, [competitionId]);
    result.rows.forEach(r => {
        competitionTeams.push({competitionId: parseInt(r['competition_id']),
                            competitionName : r['competition_name'],
                            teamId: parseInt(r['team_id']),
                            teamName: r['team_name'],
                            wins: parseInt(r['wins']),
                            draws: parseInt(r['draws']),
                            loses: parseInt(r['loses']),
                            points: parseInt(r['points'])
                    });
    })
    return competitionTeams;
}

export async function getCompetitionTeamByIds(competitionId : number, teamId :number) : Promise<CompetitionTeam> {
    const competitionTeams : CompetitionTeam[] = []
    const result = await pool.query(`SELECT competition.id competition_id, competition.name competition_name, wins, draws, loses, points, team.id team_id, team.name team_name
                                        FROM competition
                                        INNER JOIN competition_team
                                            ON competition_id = competition.id
                                        INNER JOIN team
                                            ON team.id = team_id
                                        WHERE competition.id = $1 AND team.id = $2`, [competitionId, teamId]);
    result.rows.forEach(r => {
        competitionTeams.push({competitionId: parseInt(r['competition_id']),
                            competitionName : r['competition_name'],
                            teamId: parseInt(r['team_id']),
                            teamName: r['team_name'],
                            wins: parseInt(r['wins']),
                            draws: parseInt(r['draws']),
                            loses: parseInt(r['loses']),
                            points: parseInt(r['points'])
                    });
    })
    return competitionTeams[0];
}

export async function getMatches() : Promise<Match[]> {
    const matches : Match[] = []
    const result = await pool.query(`SELECT competition.id competition_id, competition.name competition_name, match.id id, match_time, first_team_id, t1.name first_team_name, second_team_id, t2.name second_team_name, first_team_score, second_team_score, round
                                        FROM competition
                                        INNER JOIN match
                                            ON competition_id = competition.id
                                        INNER JOIN team t1
                                            ON t1.id = first_team_id
                                        INNER JOIN team t2
                                            ON t2.id = second_team_id`);
    result.rows.forEach(r => {
        let date : Date = r['match_time']
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDay()
        let hour = date.getHours()
        let mins = date.getMinutes()
        let strDate : string = day+"."+month+"."+year+" "+hour+":"+mins
        matches.push({id: r['id'],
                        competitionId: parseInt(r['competition_id']),
                        competitionName: r['competition_name'],
                        firstTeamId: parseInt(r['first_team_id']),
                        firstTeamName: r['first_team_name'],
                        secondTeamId: parseInt(r['second_team_id']),
                        secondTeamName: r['second_team_name'],
                        matchTime: strDate,
                        firstTeamScore: parseInt(r['first_team_score']),
                        secondTeamScore: parseInt(r['second_team_score']),
                        round: parseInt(r['round'])
                    });
    })
    return matches;
}

export async function getMatchesByCompetition(competitionId : number) : Promise<Match[]> {
    const matches : Match[] = []
    const result = await pool.query(`SELECT competition.id competition_id, competition.name competition_name, match.id id, match_time, first_team_id, t1.name first_team_name, second_team_id, t2.name second_team_name, first_team_score, second_team_score, round
                                        FROM competition
                                        INNER JOIN match
                                            ON competition_id = competition.id
                                        INNER JOIN team t1
                                            ON t1.id = first_team_id
                                        INNER JOIN team t2
                                            ON t2.id = second_team_id
                                        WHERE competition_id = $1
                                        ORDER BY round`, [competitionId]);
    result.rows.forEach(r => {
        let date : Date = r['match_time']
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDay()
        let hour = date.getHours()
        let mins = date.getMinutes()
        let strDate : string = day+"."+month+"."+year+" "+hour+":"+mins
        matches.push({id: r['id'],
                        competitionId: parseInt(r['competition_id']),
                        competitionName: r['competition_name'],
                        firstTeamId: parseInt(r['first_team_id']),
                        firstTeamName: r['first_team_name'],
                        secondTeamId: parseInt(r['second_team_id']),
                        secondTeamName: r['second_team_name'],
                        matchTime: strDate,
                        firstTeamScore: parseInt(r['first_team_score']),
                        secondTeamScore: parseInt(r['second_team_score']),
                        round: r['round']
                    });
    })
    return matches;
}

export async function getMatchById(matchId : number) : Promise<Match> {
    const matches : Match[] = []
    const result = await pool.query(`SELECT competition.id competition_id, competition.name competition_name, match.id id, match_time, first_team_id, t1.name first_team_name, second_team_id, t2.name second_team_name, first_team_score, second_team_score, round
                                        FROM competition
                                        INNER JOIN match
                                            ON competition_id = competition.id
                                        INNER JOIN team t1
                                            ON t1.id = first_team_id
                                        INNER JOIN team t2
                                            ON t2.id = second_team_id
                                        WHERE match.id = $1`, [matchId]);
    result.rows.forEach(r => {
        let date : Date = r['match_time']
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDay()
        let hour = date.getHours()
        let mins = date.getMinutes()
        let strDate : string = day+"."+month+"."+year+" "+hour+":"+mins
        matches.push({id: r['id'],
                        competitionId: parseInt(r['competition_id']),
                        competitionName: r['competition_name'],
                        firstTeamId: parseInt(r['first_team_id']),
                        firstTeamName: r['first_team_name'],
                        secondTeamId: parseInt(r['second_team_id']),
                        secondTeamName: r['second_team_name'],
                        matchTime: strDate,
                        firstTeamScore: parseInt(r['first_team_score']),
                        secondTeamScore: parseInt(r['second_team_score']),
                        round: r['round']
                    });
    })
    return matches[0];
}

export async function insertTeam(name : string) : Promise<number | undefined> {
    try {
        const result = await pool.query(`INSERT INTO team (name) VALUES ($1) RETURNING id`, [name]);
        return result.rows[0].id
    } catch {
        return (await getTeamByName(name)).at(0)?.id
    }
}

export async function insertCompetition(name : string, points : number[], creator : string, ) : Promise<number | undefined> {
    try {
        const result = await pool.query(`INSERT INTO competition (name, win_points, draw_points, lose_points, creator)
                                            VALUES ($1, $2, $3, $4, $5) RETURNING id`, [name, points[0], points[1], points[2], creator]);
        return result.rows[0].id
    } catch {
        return (await getCompetitionByName(name)).id;
    }
}

export async function insertCompetitionTeam(competitionId : number, teamId: number) : Promise<boolean> {
    try {
        const result = await pool.query(`INSERT INTO competition_team (competition_id, team_id, wins, draws, loses, points)
                                            VALUES ($1, $2, $3, $4, $5, $6)`, [competitionId, teamId, 0, 0, 0, 0]);
        return result.rowCount ? true : false;
    } catch {
        console.log("Error")
        return false;
    }
}

export async function insertMatch(competitionId : number, firstTeamId: number, secondTeamId : number, matchTime : Date, round : number) : Promise<boolean> {
    try {
        const result = await pool.query(`INSERT INTO match (competition_id, first_team_id, second_team_id, match_time, round)
                                            VALUES ($1, $2, $3, $4, $5) RETURNING id`, [competitionId, firstTeamId, secondTeamId, matchTime, round]);
        return result.rowCount ? true : false;
    } catch {
        console.log("Error")
        return false;
    }
}

export async function updateMatch(matchId : number, firstTeamScore : number, secondTeamScore : number) : Promise<number | undefined> {
    try {
        const result = await pool.query(`UPDATE match
                                            SET first_team_score = $2,
                                                second_team_score = $3
                                            WHERE id = $1`, 
                                            [matchId, firstTeamScore, secondTeamScore]);
        return result.rows[0];
    } catch {
        console.log("Error")
        return undefined;
    }
}

export async function updateCompetitionTeam(competitionId : number, teamId : number, wins : number, draws : number, loses : number, points : number) : Promise<number | undefined> {
    try {
        const result = await pool.query(`UPDATE competition_team
                                            SET wins = $3,
                                                draws = $4,
                                                loses = $5,
                                                points = $6
                                            WHERE competition_id = $1 AND team_id = $2`, 
                                            [competitionId, teamId, wins, draws, loses, points]);
        return result.rows[0];
    } catch {
        console.log("Error")
        return undefined;
    }
}

