export class TypingHandler {
    constructor(stateManager, textAnalyzer, metricsCalculator) {
      this.stateManager = stateManager;
      this.textAnalyzer = textAnalyzer;
      this.metricsCalculator = metricsCalculator;
    }
  
    handleInputUpdate(session, wsServer, inputData) {
      const analysis = this.textAnalyzer.analyzeDifferences(
        session.text,
        inputData.input
      );
  
      const updatedSession = this.stateManager.updateSession(session.id, {
        input: inputData.input,
        lastUpdate: Date.now()
      });
  
      // Calculate and send real-time metrics
      if (updatedSession.startTime) {
        const metrics = this.metricsCalculator.calculateMetrics(
          analysis,
          updatedSession.startTime,
          Date.now()
        );
  
        wsServer.sendMessage(session.id, 'METRICS_UPDATE', {
          analysis,
          metrics
        });
      }
  
      // Check if typing test is complete
      if (inputData.input.length >= session.text.length) {
        this.handleCompletion(session, wsServer, analysis);
      }
    }
  
    handleCompletion(session, wsServer, analysis) {
      const endTime = Date.now();
      
      const finalMetrics = this.metricsCalculator.calculateMetrics(
        analysis,
        session.startTime,
        endTime
      );
  
      const updatedSession = this.stateManager.updateSession(session.id, {      // TODO: Verify if this is intended to be here
        status: 'completed',
        endTime
      });
  
      wsServer.sendMessage(session.id, 'SESSION_COMPLETE', {
        sessionId: session.id,
        metrics: finalMetrics
      });
    }
  }