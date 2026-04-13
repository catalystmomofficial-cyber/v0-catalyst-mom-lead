export interface AnalyticsEvent {
  eventName: string
  properties?: Record<string, any>
}

export const trackEvent = (event: AnalyticsEvent) => {
  try {
    // Track to your analytics platform (Google Analytics, Mixpanel, etc.)
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", event.eventName, event.properties)
    }

    // Also send to your backend for custom tracking
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: event.eventName,
        properties: event.properties,
        timestamp: new Date().toISOString(),
      }),
    }).catch((error) => console.error("[v0] Analytics error:", error))
  } catch (error) {
    console.error("[v0] Error tracking event:", error)
  }
}

export const trackQuizEvents = {
  quizStarted: () => trackEvent({ eventName: "postpartum_quiz_started" }),
  questionAnswered: (questionNumber: number) =>
    trackEvent({
      eventName: "postpartum_question_answered",
      properties: { questionNumber },
    }),
  questionAbandoned: (questionNumber: number) =>
    trackEvent({
      eventName: "postpartum_question_abandoned",
      properties: { questionNumber },
    }),
  quizCompleted: (score: number, tier: string) =>
    trackEvent({
      eventName: "postpartum_quiz_completed",
      properties: { score, tier },
    }),
  ctaClicked: (ctaType: string) =>
    trackEvent({
      eventName: "postpartum_cta_clicked",
      properties: { ctaType },
    }),
}
