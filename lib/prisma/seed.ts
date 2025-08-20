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
    for (const category of categories) {
        await db.taskStatus.createMany({
            data: [
                {
                    name: "TODO",
                    categoryId: category.id,
                    primaryColor: "bg-gray-600"
                },
                {
                    name: "IN PROGRESS",
                    categoryId: category.id,
                    primaryColor: "bg-blue-600"
                },
                {
                    name: "DONE",
                    categoryId: category.id,
                    primaryColor: "bg-green-600"
                }
            ]
        })
    }
}

export { seedNewUser }