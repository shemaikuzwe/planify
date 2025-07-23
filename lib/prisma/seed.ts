import { db } from ".";
async function seedNewUser(userId: string) {
    const categories = await db.taskCategory.createManyAndReturn({
        data: [{
            name: "Work",
            userId
        }, {
            name: "Personal",
            userId
        }
        ]
    })
    await db.task.createMany({
        data: [
            {
                categoryId: categories[0].id,
                text: "Meet ",
                priority: "MEDIUM",
            },
            {
                categoryId: categories[1].id,
                text: "Learn"
            }
        ]
    })
}

export { seedNewUser }