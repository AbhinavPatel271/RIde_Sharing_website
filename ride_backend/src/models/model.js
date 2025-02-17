import pool from "../config/db.js";

export async function getAllPresentPendingRides(body) {
  const query = `
      SELECT 
      *
      FROM rides 
      WHERE ride_status = $1
      AND creator_email <> $2
      AND seats_available > 0
      `;
  const values = ["Pending", body.email];
  try {
    const response = await pool.query(query, values);
    console.log("Checked database successfully");
    return response.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAllFilteredPendingRides(body) {
  const { src, dest, email } = body;
  let query = `
    SELECT 
    * FROM rides 
    WHERE ride_status = $1
    AND creator_email <> $2
    AND seats_available > $3`;
  let values = ["Pending", email, 0];
  let index = 4;

  if (src !== null) {
    if (src.length !== 0 && src.trim() !== "") {
      query += ` AND source = $${index}`;
      values.push(src.trim());
      index++;
    }
  }
  if (dest !== null) {
    if (dest.length !== 0 && dest.trim() !== "") {
      query += ` AND destination = $${index}`;
      values.push(dest.trim());
      index++;
    }
  }
  try {
    const response = await pool.query(query, values);
    console.log("Database checked successfully");
    return response.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAllUserCompletedRides(email) {
  const query1 = ` 
    SELECT r.id,  
    COALESCE(STRING_AGG(rd.req_name, ', '), 'No partners') AS req_names,
    COALESCE(STRING_AGG(rd.req_phone, ', '), '-') AS req_phones,
    r.source, r.destination, r.date, r.time, r.total_cost, r.ride_status,
    COALESCE(AVG(rd.rating), 0) AS avg_rating
    FROM rides r
    LEFT JOIN ride_details rd ON rd.id = r.id AND rd.req_status = $2
    WHERE r.creator_email = $1  
    AND r.ride_status = $3
    GROUP BY r.id , r.source, r.destination, r.date, r.time, r.total_cost, r.ride_status
  `;


  const values1 = [email, "Accepted", "Completed"];

  const query2 = `
      SELECT rd.id, rd.ride_status,
      STRING_AGG(rd.req_name, ', ') AS req_names,
      STRING_AGG(rd.req_phone, ', ') AS req_phones,
      AVG(rd.rating) AS avg_rating,   
      r.source, r.destination, r.date, r.time, r.total_cost, r.creator_name, r.creator_phone
      FROM ride_details rd
      INNER JOIN rides r ON rd.id = r.id
      WHERE rd.id IN (
      SELECT DISTINCT id 
      FROM ride_details 
      WHERE req_email = $1 AND ride_status = $2 )
      GROUP BY rd.id, rd.ride_status, r.source, r.destination, r.date, r.time, r.total_cost, r.creator_name, r.creator_phone
      `;

  const values2 = [email, "Completed"];

  try {
    const response1 = await pool.query(query1, values1);
    const response2 = await pool.query(query2, values2);
    const merged = {
      selfCreatedRides: response1.rows,
      othersCreatedRides: response2.rows,
    };

    console.log("Checked database successfully");
    console.log(response1.rows.length);
    console.log(response2.rows.length);

    return merged;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAllUserSpecificPendingRides(email) {
  const query1 = ` 
  SELECT 
  r.id,  
  COALESCE(STRING_AGG(rd.req_name, ','), 'No partners') AS req_names,
  COALESCE(STRING_AGG(rd.req_phone, ','), '-') AS req_phones,
  r.source, r.destination, r.date, r.time, 
  r.total_cost, r.seats_available, r.creator_name, r.creator_phone, r.ride_status      
FROM rides r  
LEFT JOIN ride_details rd ON rd.id = r.id 
  AND rd.req_status = $3   
WHERE r.creator_email = $1  
AND r.ride_status = $2  
GROUP BY r.id, r.source, r.destination, r.date, r.time, 
         r.total_cost, r.seats_available, r.creator_name, r.creator_phone, r.ride_status;

  `;
  const values1 = [email, "Pending", "Accepted"];

  const query2 = `
  SELECT rd.id, rd.ride_status, rd.req_status, 
  STRING_AGG(rd.req_name, ',') AS req_names,
  STRING_AGG(rd.req_phone, ',') AS req_phones,
  r.source, r.destination, r.date, r.time, r.total_cost, r.creator_name, r.creator_phone
  FROM ride_details rd
  INNER JOIN rides r ON rd.id = r.id
  WHERE rd.id IN (
  SELECT DISTINCT id 
  FROM ride_details 
  WHERE req_email = $1 AND ride_status = $2 AND req_status <> $3)
  GROUP BY rd.id , rd.ride_status, rd.req_status, r.source, r.destination, r.date, r.time, r.total_cost, r.creator_name, r.creator_phone
  `;

  const values2 = [email, "Pending", "Pending"];

  try {
    const response1 = await pool.query(query1, values1);
    const response2 = await pool.query(query2, values2);
    const merged = {
      selfCreatedRides: response1.rows,
      othersCreatedRides: response2.rows,
    };
    return merged;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function handleUserSentRequest(body) {
  const {
    id,
    creator_name,
    creator_phone,
    creator_email,
    req_email,
    req_name,
    req_number,
    req_message,
  } = body;

  let canMakeRequest = false;
  const queryForReqCheck = `
  SELECT * 
  FROM ride_details
  WHERE 
  id = $1 AND
  req_email = $2
  `;
  const valuesForReqCheck = [id, req_email];
  const query = `
    INSERT INTO ride_details 
    (id, creator_name , creator_phone , creator_email, req_email, req_name, req_phone, req_msg, req_status , ride_status)
    VALUES 
    ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10)`;

  const req_msg =
    req_message.length !== 0 && req_message.trim() !== ""
      ? req_message
      : "No message";
  const values = [
    id,
    creator_name,
    creator_phone,
    creator_email,
    req_email,
    req_name,
    req_number,
    req_msg,
    "Pending",
    "Pending",
  ];
  try {
    const reqCheckResult = await pool.query(
      queryForReqCheck,
      valuesForReqCheck
    );

    if (reqCheckResult.rows.length == 0) {
      canMakeRequest = true;
    } else {
      const req_status = reqCheckResult.rows[0].req_status;

      if (req_status === "Accepted") return "Accepted";
      else if (req_status === "Pending") return "Pending";
      else canMakeRequest = true;
    }
    if (canMakeRequest) {
      await pool.query(query, values);
      return "Request_Made";
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function handleUserReceivedRequest(body) {
  const { id, req_email, creator_email, signal, msg } = body;

  const message = msg.length != 0 && msg.trim() != "" ? msg : "No message";
  const query = `
    UPDATE ride_details 
    SET req_status = $1,
        creator_reply = $2
    WHERE id = $3 AND 
    creator_email = $4 AND    
    req_email = $5
    `;

  const values = [signal, message, id, creator_email, req_email];

  try {
    if (signal === "Accepted") {
      const queryForUpdation = `UPDATE rides 
      SET seats_available = seats_available - 1
      WHERE id = $1;`;
      const valuesForUpdation = [id];
      await pool.query(queryForUpdation, valuesForUpdation);
    }

    await pool.query(query, values);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function addNewlyCreatedRide(body) {
  const {
    email,
    source,
    destination,
    date,
    time,
    rideType,
    seatsAvailable,
    totalCost,
    createdBy,
    phone,
  } = body;

  const query = `
    INSERT INTO rides 
    (source, destination, date, time, ride_type, seats_available, total_cost, creator_name, creator_phone , creator_email , ride_status) 
    VALUES 
    ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11)`;
  const values = [
    source,
    destination,
    date,
    time,
    rideType,
    seatsAvailable,
    totalCost,
    createdBy,
    phone,
    email,
    "Pending",
  ];
  try {
    await pool.query(query, values);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getReceivedRequests(email) {
  const query = `
    SELECT rd.id, rd.req_email ,rd.req_name, rd.req_phone, rd.req_msg, rd.ride_status,
    r.source, r.destination, r.time, r.date 
    FROM ride_details rd
    INNER JOIN rides r ON rd.id = r.id
    WHERE rd.creator_email = $1 
    AND rd.req_status = $2
    AND r.ride_status = $3 
`;
  const values = [email, "Pending", "Pending"];

  try {
    const response = await pool.query(query, values);
    return response.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getSentRequests(email) {
  const query = `
    SELECT rd.id, rd.ride_status, rd.req_status,
    r.source, r.destination, r.time, r.date, r.creator_name, r.creator_phone 
    FROM ride_details rd
    INNER JOIN rides r ON rd.id = r.id
    WHERE rd.req_email = $1 
    AND rd.req_status = $2    
    AND r.ride_status = $3    
`;
  const values = [email, "Pending", "Pending"];
  try {
    const response = await pool.query(query, values);
    return response.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAvailablePendingLocation(body) {
  const query = `
      SELECT source , destination
      FROM rides
      WHERE 
      ride_status = $1 AND
      creator_email <> $2 AND 
      seats_available > $3
      `;
  const values = ["Pending", body.email , 0];

  try {
    const response = await pool.query(query, values);
    return response.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function markRideMakerRideAsCompleted(id) {
  const query = `
    UPDATE rides
    SET ride_status = $1
    WHERE id = $2  
    `;
  const values = ["Completed", id];
  try {
    await pool.query(query, values);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function markRideSharerRideResponse(body) {
  const { id, email, signal, rating } = body;
  const query = `
  UPDATE ride_details
  SET ride_status = $1,
      rating = $4
  WHERE id = $2 AND
  req_email = $3 
  `;

  const values = [signal, id, email, rating];
  try {
    await pool.query(query, values);
  } catch (error) {
    throw new Error(error.message);
  }
}
