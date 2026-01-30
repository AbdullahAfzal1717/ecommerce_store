import { Div } from "@jumbo/shared";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import PropTypes from "prop-types";

const OnlineSignupChart = ({ color, shadowColor, data }) => {
  // Check your console - you'll see the objects have 'revenue' and 'hKey'

  return (
    <ResponsiveContainer height={80}>
      <LineChart data={data} className={"mx-auto"}>
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="8"
              floodColor={shadowColor ? shadowColor : "#6610f2"}
            />
          </filter>
        </defs>
        <Tooltip
          cursor={false}
          content={({ active, payload }) => {
            return active && payload && payload.length ? (
              <Div sx={{ color: "common.white", fontSize: "10px" }}>
                {/* payload[0].payload.hKey gets the month name from the object */}
                {`${payload[0].payload.hKey}: Rs. ${payload[0].value}`}
              </Div>
            ) : null;
          }}
          wrapperStyle={{
            backgroundColor: color ? color : "rgba(0,0,0,.8)",
            padding: "5px 8px",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        />
        {/* Changed dataKey to hKey to match your backend */}
        <XAxis dataKey="hKey" hide />

        <Line
          dataKey="revenue" // Changed from 'count' to 'revenue'
          filter="url(#shadow)"
          type="monotone"
          dot={false}
          strokeWidth={3}
          stroke={color ? color : "#FFFFFF"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { OnlineSignupChart };

OnlineSignupChart.propTypes = {
  color: PropTypes.string,
  shadowColor: PropTypes.string,
  data: PropTypes.array, // Added this missing prop type
};
