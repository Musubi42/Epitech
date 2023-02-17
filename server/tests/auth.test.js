const request = require("supertest")
const baseURL = "http://localhost:5000"


describe("GET /todos", () => {
  const newUser = {
    nickname: "Jean",
    password: "Drink water",
    avatar: "https://randomuser.me/api/portraits/42/42.jpg",
    }
    beforeAll(async () => {
      // set up the todo
      await request(baseURL).post("/register").send(newUser
        );
     })
    afterAll(async () => {
      await request(baseURL).delete(`/todo/${newTodo.id}`)
    })
    it("should return 200", async () => {
      const response = await request(baseURL).get("/todos");
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(null);
    });
    it("should return todos", async () => {
      const response = await request(baseURL).get("/todos");
      expect(response.body.data.length >= 1).toBe(true);
    });
  });