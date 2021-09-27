import { ChartData, ChartMetaInfo, IExternalSaveLoadAdapter, ResolutionString, StudyTemplateData, StudyTemplateMetaInfo } from "../../../public/charting_library/charting_library";

interface ChartMeta {
  id: number;
	name: string;
	symbol: string;
	resolution: ResolutionString;
	content: string;
  timestamp: number;
}

interface DrawingTemplate {
  name: string;
  content: string;
}

export class SaveLoadAdapter implements IExternalSaveLoadAdapter {
  charts: ChartMeta[] = []
  studyTemplates: StudyTemplateMetaInfo[] = []
  drawingTemplates: DrawingTemplate[] = []

  getAllCharts(): Promise<ChartMetaInfo[]> {
    const sCharts = localStorage.getItem('charts')
    if(sCharts) {
      const charts: ChartMeta[] = JSON.parse(sCharts)
      this.charts = charts
      return Promise.resolve(charts)
    }
    return Promise.resolve([])
  }
  removeChart<T extends string | number>(id: T): Promise<void> {
    for (var i = 0; i < this.charts.length; ++i) {
      if (this.charts[i].id === id) {
        this.charts.splice(i, 1)
        this.persist()
        return Promise.resolve()
      }
    }
    return Promise.reject()
  }
  saveChart(chartData: ChartData): Promise<number> {
    if (!chartData.id) {
      chartData.id = Math.random().toString();
    } else {
      this.removeChart(chartData.id);
    }

    const chart: ChartMeta = {
      id: +chartData.id,
      name: chartData.name,
      symbol: chartData.symbol,
      resolution: chartData.resolution,
      timestamp: new Date().valueOf(),
      content: chartData.content
    }

    this.charts.push(chart);
    this.persist()
    return Promise.resolve(chart.id);
  }
  getChartContent(chartId: number): Promise<string> {
    for (var i = 0; i < this.charts.length; ++i) {
      if (this.charts[i].id === chartId) {
        return Promise.resolve(this.charts[i].content);
      }
    }

    console.error('error');

    return Promise.reject();
  }
  getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]> {
    return Promise.resolve(this.studyTemplates);
  }
  removeStudyTemplate(studyTemplateInfo: StudyTemplateMetaInfo): Promise<void> {
    for (var i = 0; i < this.studyTemplates.length; ++i) {
      if (this.studyTemplates[i].name === studyTemplateInfo.name) {
        this.studyTemplates.splice(i, 1);
        this.persist()
        return Promise.resolve();
      }
    }
    return Promise.reject();
  }
  saveStudyTemplate(studyTemplateData: StudyTemplateData): Promise<void> {
    for (var i = 0; i < this.studyTemplates.length; ++i) {
      if (this.studyTemplates[i].name === studyTemplateData.name) {
        this.studyTemplates.splice(i, 1);
        break;
      }
    }
    this.studyTemplates.push(studyTemplateData);
    this.persist()
    return Promise.resolve();
  }
  getStudyTemplateContent(studyTemplateInfo: StudyTemplateMetaInfo): Promise<string> {
    for (var i = 0; i < this.studyTemplates.length; ++i) {
      if (this.studyTemplates[i].name === studyTemplateInfo.name) {
          return Promise.resolve(this.studyTemplates[i].name);
      }
    }

    console.error('st: error');

    return Promise.reject();
  }
  getDrawingTemplates(toolName: string): Promise<string[]> {
    return Promise.resolve(this.drawingTemplates.map(function(template) {
      return template.name;
    }));
  }
  loadDrawingTemplate(toolName: string, templateName: string): Promise<string> {
    for (var i = 0; i < this.drawingTemplates.length; ++i) {
      if (this.drawingTemplates[i].name === templateName) {
          return Promise.resolve(this.drawingTemplates[i].content);
      }
    }

    console.error('drawing: error');

    return Promise.reject();
  }
  removeDrawingTemplate(toolName: string, templateName: string): Promise<void> {
    for (var i = 0; i < this.drawingTemplates.length; ++i) {
      if (this.drawingTemplates[i].name === templateName) {
        this.drawingTemplates.splice(i, 1);
        this.persist()
        return Promise.resolve();
      }
    }
    return Promise.reject();
  }
  saveDrawingTemplate(toolName: string, templateName: string, content: string): Promise<void> {
    for (var i = 0; i < this.drawingTemplates.length; ++i) {
      if (this.drawingTemplates[i].name === templateName) {
          this.drawingTemplates.splice(i, 1);
          break;
      }
    }

    this.drawingTemplates.push({ name: templateName, content: content });
    this.persist()
    return Promise.resolve();
  }
  persist() {
    localStorage.setItem('charts', JSON.stringify(this.charts))
    localStorage.setItem('study_templates', JSON.stringify(this.studyTemplates))
    localStorage.setItem('drawing_templates', JSON.stringify(this.drawingTemplates))
  }
}

