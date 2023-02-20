import { Hono } from "hono";
const app = new Hono();

// BMI class values
const bmiClassValues = {
	18.5: "Underweight",
	25: "Normal",
	30: "Overweight",
	35: "Obese",
	40: "Extremely obese",
	[Number.POSITIVE_INFINITY]: "Morbidly obese"
};

app.get("/bmi", (c) => {
	// Variable declaration
	let system: string;
	let height: number;
	let weight: number;

	// Check if height and weight are present
	if (!c.req.query('height') && !c.req.query('weight')) {
		return c.json({ "Error": "Missing height and weight parameter." }, 400);
	}
	if (!c.req.query('height')) {
		return c.json({ "Error": "Missing height parameter." }, 400);
	}
	if (!c.req.query('weight')) {
		return c.json({ "Error": "Missing weight parameter." }, 400);
	}

	// Get query parameters
	if (c.req.query('system') === 'metric') {
		system = 'metric';
	} else {
		system = 'imperial';
	}

	// Get height and weight
	weight = Number(c.req.query('weight'));
	height = Number(c.req.query('height'));
	if (system === 'metric') {
		height = height / 100;
	}

	// Calculate BMI
	let bmi: number;
	if (system === 'metric') {
		bmi = weight / (height * height);
	} else {
		bmi = (weight / (height * height)) * 703;
	}

	// Get BMI class
	let bmiClass: string | undefined;
	for (const key in bmiClassValues) {
		if (bmi < Number(key)) {
			bmiClass = bmiClassValues[key];
			break;
		}
	}

	// Round BMI to 1 decimal place
	bmi = Math.round(bmi * 10) / 10;

	return c.json({ "BMI": bmi, "Class": bmiClass });
});

export default app