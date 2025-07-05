async function cleanMeetingLink(meetingLink: string) {
    const meetingId = meetingLink.split("/").pop()
    if (!meetingId) {
        return null
    }
    console.log("meetingId", meetingId)
    return meetingId
}

export { cleanMeetingLink }