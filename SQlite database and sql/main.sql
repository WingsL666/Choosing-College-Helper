Create table Cost(  
    c_university_name char(50) primary key,
    c_room_cost integer,
    c_in_state_tuition integer,
    c_in_state_total integer,
    c_out_state_tuition integer,
    c_out_state_total integer
);

Create table Degree(  -- no primary key
    d_major_name char(50),
    d_length integer,
    d_level char(50)
);

Create table DegreeOf(  -- no primary key
    do_university_name char(50),
    do_major_name char(50),
    do_level char(50)
);

Create table MajorOffer( -- no primary key, still have to complete this, salary info needed
    mo_university_name char(50),
    mo_major_name char(50)
);

Create table Major(
    m_major_name char(50) primary key,
    m_general char(50),
    m_startcareer_earning integer,
    m_midcareer_earning integer
);


Create table Population(  
    p_university_name char(50) primary key,
    p_total integer,
    p_asian integer,
    p_african_american integer,
    p_hispanic integer,
    p_white integer,
    p_other integer
);

Create table Ranking(  -- import success
    r_university_name char(50) primary key,
    r_world_rank integer,
    r_nation_rank integer
);

Create table Score(  -- import success
    s_university_name char(50) primary key,
    s_average_score decimal(4,1),
    s_citation decimal(4,1),
    s_research decimal(4,1),
    s_teaching decimal(4,1)
);

Create table University(
    u_university_name char(50) primary key,
    u_school_type char(20),
    u_state char(30)
);



-- ============SQL QUERIES FOR PHASE 2========
-- ========= BASIC QUERIES FOR USE-CASE ===========
-- ======COST TABLE=====
-- Q1,looking for cost in a specific university
-- different possible queries for different cost
select c_university_name, c_room_cost
from Cost
where c_university_name = "Cornell University";

-- Q2
select c_university_name, c_in_state_tuition
from Cost
where c_university_name = "Cornell University";

-- Q3
select c_university_name, c_out_state_tuition
from Cost
where c_university_name = "Cornell University";

-- Q4 
select c_university_name, c_in_state_total
from Cost
where c_university_name = "Cornell University";

-- Q5
select c_university_name, c_out_state_total
from Cost
where c_university_name = "Cornell University";

-- =====DEGREE TABLE==== (view majors)
-- Q6, major and degree level that are offfered at a specific university
select do_major_name, do_level
from DegreeOf
where do_university_name = "Cornell University";

-- Q7, universities that offers Special Education and Teaching(specific major) as major
SELECT do_university_name
from Degree, DegreeOf
where d_major_name=do_major_name and
d_major_name = 'Special Education and Teaching';

--  Q8, years it'll take to finish a certain major for a certain level
select distinct d_major_name, d_length
from Degree
where d_level = 'Doctoral Degree'
and d_major_name = 'Educational Administration and Supervision';

-- Q9 , majors that are offered in bachelor's but not in Phd degree
--at a specific university
select distinct d_major_name
from Degree, DegreeOf
where do_major_name=d_major_name
and do_level = "Bachelor's Degree"
and do_university_name = "Auburn University"
and do_major_name NOT IN 
        (select do_major_name from degreeOf 
        where do_level = "Doctoral Degree");

-- ===== DEGREEOF TABLE ====
-- Q10, looking for possible majors in bachelor's(or master's, doctorate, and so on)
select do_major_name
from DegreeOf
where do_level = "Bachelor's Degree";

-- Q11, dsiplaying possible different level of eduacation 
select distinct do_level
from DegreeOf;

-- ==== MajorOffer TABLE ========
-- Q12, possible majors in engineering field
select distinct mo_major_name
from majorOffer
where mo_major_name LIKE '%engineering';

-- Q13, displaying what field a specific major fall under 
select m_general
from Major
where m_major_name = 'Animal Sciences';

-- ==========MAJOR TABLE ========
-- Q14, displaying entry level and mid level salary for a specific major
select m_major_name, m_startcareer_earning, m_midcareer_earning
from major
where m_major_name = 'Forestry';

-- Q15, displaying majors that have more tha 40000 as a starting salary
select m_major_name
from Major
where m_startcareer_earning > 40000;

-- ===== POPULATION TABLE =====
-- Q16, viewing population in a specific uni (view population)
select *
from Population
where p_university_name = 'Cornell University';

--Select university depend on their school size
--Q17, Medium
select p_university_name
from Population
where 
p_total >= 2000 and 
p_total <= 15000;

--Q18, Large
select p_university_name
from Population
where 
p_total > 15000;

-- ===== RANKING TABLE ====== 
-- Q19, display rank place of specific university
select r_university_name, r_nation_rank, r_world_rank
from Ranking
where r_university_name = 'Emory University';

-- ===== SCORE TABLE ======
-- Q20, display score of specific university in each aspect
select *
from score 
where s_university_name = 'Emory University';


-- ==== UNIVERSITY TABLE ======
-- Q21, display universities in specific state
select u_university_name
from University
where u_state = 'California';


-- ==== JOINS=====
-- Q22 looking for a universit in Cali that would cost less that 50000
select u_university_name, u_state, c_in_state_total
from university, Cost
where u_university_name=c_university_name
and u_state = 'California'
and c_in_state_total < 70000;


-- Q23, looking for public universities that offer Physics as major in bachelor's
select do_university_name, u_school_type, do_major_name
from university, DegreeOf
where do_university_name=u_university_name
and do_major_name LIKE '%physics'
and u_school_type LIKE '%public'
and do_level LIKE  "%Bachelor's Degree";

-- Q24, universities that have a score > 10, and offers physics as major
select distinct do_major_name, s_average_score
from degreeOf, Score
where do_university_name=s_university_name
and s_average_score > 70
and do_major_name LIKE '%physics';

-- Q25, displaying majors and their expected entry-level salary
select m_major_name, m_startcareer_earning
from Major;
--where m_startcareer_earning > 20000;

-- Q26, displaying cost and state
select u_university_name, u_state, c_out_state_total
from cost, University 
where u_university_name=c_university_name;

-- ========= MORE COMPLEX QUERIES ============
--Find the percentage of racial groups for each university
--use cast to make attributes from int to float so they won't rounf off to 0
-- Q26, then use printf('%.2f', ...) to round off to two decimal place
select p_university_name, 
        printf('%.2f', cast(p_asian as float) / cast(p_total as float) ) as asian_percentage, 
        printf('%.2f', cast(p_african_american as float) / cast(p_total as float) ) as african_american_percentage, 
        printf('%.2f', cast(p_hispanic as float) / cast(p_total as float) ) as hispanic_percentage, 
        printf('%.2f', cast(p_white as float) / cast(p_total as float) ) as white_percentage, 
        printf('%.2f', cast(p_other as float) / cast(p_total as float) )  as other_percentage
from Population;


-- Q28, Find the universities that are within top100 in US sorted by rank with increasing order
select *
from Ranking
where 
r_nation_rank <= 100
order by r_nation_rank;

-- Q29, Find # of top 100 university within each state and find the state(s) that have the most top 100 university
select S2.state as state
from 
    (select u_state as state, count(*) as cnt
    from University
    where 
    u_university_name in 
                        (select r_university_name
                        from Ranking
                        where 
                        r_nation_rank <= 100
                        order by r_nation_rank)
    group by state) S2
where 
S2.cnt = 
        (select max(cnt) as max_cnt
        from 
            (select u_state as state, count(*) as cnt
            from University
            where 
            u_university_name in 
                                (select r_university_name
                                from Ranking
                                where 
                                r_nation_rank <= 100
                                order by r_nation_rank)
            group by state) );


--Q30, find public university that have above average score for citation, resaerch, and teaching
select u_university_name
from University
where 
u_university_name in 
                    (select s_university_name
                    from Score,
                        (select avg(s_citation) as c, avg(s_research) r, avg(s_teaching) t
                        from Score) AVG
                    where 
                    s_citation >= AVG.c and 
                    s_research >= AVG.r and 
                    s_teaching >= AVG.t) and 
u_school_type = 'Public';


--Q31, Order university for each state with their world ranking and then avg score
select u_state, u_university_name, r_world_rank, s_average_score
from University, Ranking, Score
where 
u_university_name = r_university_name and 
u_university_name = s_university_name
--u_state = ?
group by u_state, r_world_rank, s_average_score;


----------Cost and Benefit from Going to University--------------------
--Q32. print state and university that satisfy below condition
select U.state, U.university
from 
    /*Q25, 1. Suggest university that offer 
        majors that earn more than 30000 as start-career 
        and tuition(in state or outstate) cost less than 30000 per year
        with a degree length at most 4 year
        print state, university name, major, earning, tuition cost. order by earning, tuition cost
    */
    (select u_state as state,
        mo_university_name as university, 
        mo_major_name as major, 
        m_general as general_major, 
        do_level as degree,
        d_length as degree_length,
        m_startcareer_earning as earning,
        case 
        when c_in_state_tuition < 30000 then c_in_state_tuition
        else c_out_state_tuition
        end as tuition_cost

    from University, MajorOffer, Major, DegreeOf, Degree, Cost
    where 
    u_university_name = mo_university_name and 
    mo_university_name = c_university_name and 
    do_university_name = c_university_name and 
    mo_major_name = m_major_name and 
    mo_major_name = d_major_name and 
    do_major_name = d_major_name and 
    do_level = d_level and 
    COALESCE(m_startcareer_earning, 0) and --eliminate NULLs
    --m_general = ? and 
    m_startcareer_earning > 30000 and --m_startcareer_earning > ?
    (c_in_state_tuition < 30000 or c_out_state_tuition < 30000) and --c_in_state_tuition < ? or c_out_state_tuition < ?
    d_length <= 4 ) U
--where U.state = 'California' --user can select which ever prefer state
group by U.state, U.university;


----------------Choose college base on cost, location, score------------------------
/*Q33, Given the state where user live in, show the all cost 
    user need to pay for each university. 
    Print state, university name, school type, avg score, and total cost,
    order those universities by total cost in incresing order
*/
select * 
from 
    --Get out state total cost if user live in same state as where university locate
    (select u_state as state, 
        c_university_name as university, 
        u_school_type as type,  
        printf('%.2f', s_average_score) as avg_score, 
        c_out_state_total as total_cost
    from University, Cost, Score
    where 
    u_university_name = c_university_name and 
    u_university_name = s_university_name and 
    c_university_name not in 
                            --Get all out state university
                            (select u_university_name as university 
                            from University
                            where u_state = 'California') --u_state = ? put state where user live here
    UNION 
    --Get in state total cost if user live in same state as where university locate
    select u_state as state, 
        c_university_name as university, 
        u_school_type as type,  
        printf('%.2f', s_average_score) as avg_score, 
        c_in_state_total as total_cost
    from University, Cost, Score
    where 
    u_university_name = c_university_name and 
    u_university_name = s_university_name and 
    c_university_name in 
                        --Get all in state university
                        (select u_university_name as university 
                        from University
                        where u_state = 'California') ) U--u_state = ? put state where user live here
--where U.state = ? --user can select which ever prefer state, without this line, is gonna show all university
-- and U.type = ?
order by U.total_cost; --or can order by score depend on what user choose


----------Choose college by Academic First-------------------
/* User can choose a general major they are looking for and get
    university that offer those genreal major, 
    print university name, world ranking, nation ranking,
    order by avgscore in drecresing order, (citation or research or teaching)
    After that, user can choose a university from the output result 
    university and check out more specific major and degree that 
    is belong to the general major user choose before
*/
/*Q34. choose a general major they are looking for and get
    university that offer those genreal major, 
    print university name, world ranking, nation ranking,
    order by avgscore in drecresing order, (citation or research or teaching)*/
select distinct u_university_name as university, 
        r_world_rank as world_ranking,
        r_nation_rank as nation_ranking, 
        printf('%.2f', s_average_score) as avg_score
        --, printf('%.2f', s_?)
from University, MajorOffer, Major, Ranking, Score
where 
u_university_name = mo_university_name and 
u_university_name = r_university_name and 
u_university_name = s_university_name and
m_major_name = mo_major_name and 
m_general = 'Computer Science' -- m_general = ?
order by s_average_score desc;--,s_citation or s_resaerch or s_?

/*Q35. user can choose a university from the output result 
    university and check out more specific major and degree that 
    is belong to the general major user choose before*/
select mo_major_name as major, d_level as degree, d_length as degree_length
from MajorOffer, Major, DegreeOf, Degree
where 
mo_university_name = do_university_name and 
mo_major_name = m_major_name and 
m_major_name = d_major_name and 
d_major_name = do_major_name and 
do_level = d_level and 
m_general = 'Computer Science' and --m_general = ? automatically pass from 1. to 2.
mo_university_name = 'California Institute of Technology'; -- mo_university_name = ? user input
--------------------------------------------------------------


-- ===== EXAMPLE USE OF Insert and delete function =====

INSERT INTO University
VALUES ('UC Merced', 'Public', 'California');

UPDATE University set u_university_name = 'University of California Merced'
WHERE u_university_name = 'UC Merced';

DELETE FROM University WHERE u_university_name = 'University of California Merced';
