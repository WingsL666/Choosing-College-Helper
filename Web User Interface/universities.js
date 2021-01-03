//========SQL QUERIES=======
//[] are the arguments for the question marks


const sqlite3 = require('sqlite3')
const Promise = require('bluebird')


class University {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        })
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    allUniversities() {       //sql for allmakers
        return this.all(
            "SELECT DISTINCT u_university_name FROM University", [])
    }

    allStates(){
        return this.all(
            "SELECT distinct u_state FROM University", [])
    }

    allSchoolTypes(){
        return this.all(
            "SELECT distinct u_school_type FROM University", [])
    }

    MajorForaUni(u_name)  { //this is for list majors (degree and level) printed
        //return this.all("select mo_major_name from majorOffer where mo_university_name = ? ", [u_name])
        return this.all("select do_major_name as major, do_level as level " +
                        "from degreeOf where do_university_name = ?", [u_name])
    }
    PopForaUni(u_name)  {
        return this.all("select p_total as 'Total Population' from population where p_university_name = ?", [u_name])
    }
    CostForaUni(u_name)  {
        return this.all("select c_room_cost as 'room cost', c_in_state_tuition as 'In-state-Tuition', " +
        "c_in_state_total as 'In-State-Total', c_out_state_tuition as 'Out-state-Tuition', " +
        "c_out_state_total as 'Out-State-Total' " +
         "from Cost where c_university_name = ?", [u_name])
    }
    RankingForaUni(u_name)  {
        return this.all("select r_nation_rank as 'Nationwide Rank', r_world_rank as 'Worldwide Rank' from Ranking where r_university_name = ?", [u_name])
    }

    ScoreForaUni(u_name)    {
        return this.all("select ROUND(s_average_score, 2) as s_average_score, s_citation, s_research, s_teaching from Score where s_university_name = ?", [u_name])
    }

    RaceForaUni(u_name)    {
        return this.all("select p_asian, p_african_american, p_hispanic, p_white, p_other from population where p_university_name=?", [u_name])
    }

    IncomeForaUni(u_name)   {
        return this.all("select m_major_name, m_startcareer_earning, m_midcareer_earning from major, majoroffer where m_major_name=mo_major_name and mo_university_name = ?", [u_name])
    }
//
    allGeneralMajor(){
        return this.all(
            "SELECT distinct m_general FROM Major where m_general is not NULL order by m_general",[])
    }

    allUniGeneralMajor(m_general){//contain all university and their score that offer the genral major user choose
        return this.all(
            "select distinct u_university_name as university, "+
            "r_world_rank as world_ranking, "+
            "r_nation_rank as nation_ranking, "+ 
            "printf('%.2f', s_average_score) as avg_score "+
            "from University, MajorOffer, Major, Ranking, Score "+
            "where "+ 
            "u_university_name = mo_university_name and "+ 
            "u_university_name = r_university_name and "+ 
            "u_university_name = s_university_name and "+
            "m_major_name = mo_major_name and "+ 
            "m_general = ? " +
            "order by s_average_score desc;", [m_general])
    }

    allUniGeneral(m_general){//contain all university that offer the genral major user choose
        return this.all(
            "select distinct u_university_name as university "+
            "from University, MajorOffer, Major, Ranking, Score "+
            "where "+ 
            "u_university_name = mo_university_name and "+ 
            "u_university_name = r_university_name and "+ 
            "u_university_name = s_university_name and "+
            "m_major_name = mo_major_name and "+ 
            "m_general = ? " +
            "order by s_average_score desc;", [m_general])
    }


    CostBaseOnLocationType(u_state,u_school_type){
        return this.all(
            "select * "+
            "from "+
                "(select u_state as state, "+
                    "c_university_name as university, "+
                    "u_school_type as type, "+  
                    "printf('%.2f', s_average_score) as avg_score, "+ 
                    "c_out_state_total as total_cost "+
                "from University, Cost, Score "+
                "where "+ 
                "u_university_name = c_university_name and "+ 
                "u_university_name = s_university_name and "+ 
                "c_university_name not in "+ 
                                        "(select u_university_name as university "+ 
                                        "from University "+
                                        "where u_state = ?) "+
                "UNION "+ 
                "select u_state as state, "+ 
                    "c_university_name as university, "+ 
                    "u_school_type as type, "+  
                    "printf('%.2f', s_average_score) as avg_score, "+ 
                    "c_in_state_total as total_cost "+
                "from University, Cost, Score "+
                "where "+ 
                "u_university_name = c_university_name and "+ 
                "u_university_name = s_university_name and "+ 
                "c_university_name in "+ 
                                    "(select u_university_name as university "+ 
                                    "from University "+
                                    "where u_state = ?) )U "+
            "where " +
            "U.type = ? "+
            "order by U.total_cost", [u_state,u_state,u_school_type])
    }

    allCostEarning(tuition, earning){
        return this.all(
            "select U.state as states, U.university as universities " +
            "from " +
                "(select u_state as state, " +
                    "mo_university_name as university, " + 
                    "mo_major_name as major, " +
                    "m_general as general_major, " + 
                    "do_level as degree, " +
                    "d_length as degree_length, " +
                    "m_startcareer_earning as earning, " +
                    "case " + 
                    "when c_in_state_tuition < 30000 then c_in_state_tuition " +
                    "else c_out_state_tuition " +
                    "end as tuition_cost " +
                "from University, MajorOffer, Major, DegreeOf, Degree, Cost " +
                "where " + 
                "u_university_name = mo_university_name and " + 
                "mo_university_name = c_university_name and " + 
                "do_university_name = c_university_name and "+
                "mo_major_name = m_major_name and " + 
                "mo_major_name = d_major_name and " +
                "do_major_name = d_major_name and " +
                "do_level = d_level and " +
                "COALESCE(m_startcareer_earning, 0) and "+
                "m_startcareer_earning > ? and " +
                "(c_in_state_tuition < ? or c_out_state_tuition < ?) and " +
                "d_length <= 4 ) U " +
            "group by U.state, U.university;", [earning, tuition, tuition])
    }

    StateCostEarning(states, tuition, earning){
        return this.all(
            "select U.state as states, U.university as universities " +
            "from " +
                "(select u_state as state, " +
                    "mo_university_name as university, " + 
                    "mo_major_name as major, " +
                    "m_general as general_major, " + 
                    "do_level as degree, " +
                    "d_length as degree_length, " +
                    "m_startcareer_earning as earning, " +
                    "case " + 
                    "when c_in_state_tuition < 30000 then c_in_state_tuition " +
                    "else c_out_state_tuition " +
                    "end as tuition_cost " +
            
                "from University, MajorOffer, Major, DegreeOf, Degree, Cost " +
                "where " + 
                "u_university_name = mo_university_name and " + 
                "mo_university_name = c_university_name and " + 
                "do_university_name = c_university_name and "+
                "mo_major_name = m_major_name and " + 
                "mo_major_name = d_major_name and " +
                "do_major_name = d_major_name and " +
                "do_level = d_level and " +
                "COALESCE(m_startcareer_earning, 0) and "+
                "m_startcareer_earning > ? and " +
                "(c_in_state_tuition < ? or c_out_state_tuition < ?) and " +
                "d_length <= 4 ) U " +
            "where U.state = ? " +
            "group by U.state, U.university;", [earning, tuition, tuition, states])
    }

    displaySpecificMajor(general, university){
        return this.all(
            "select mo_major_name as major, d_level as degree, d_length as degree_length "+
            "from MajorOffer, Major, DegreeOf, Degree "+
            "where " + 
            "mo_university_name = do_university_name and "+ 
            "mo_major_name = m_major_name and "+ 
            "m_major_name = d_major_name and "+ 
            "d_major_name = do_major_name and "+ 
            "do_level = d_level and "+ 
            "m_general = ? and "+
            "mo_university_name = ?;", [general, university])
    }
}

    module.exports = University