// ROI Calculator Application Logic

class ROICalculator {
    constructor() {
        this.botTypes = {
            "simple": { name: "Простой FAQ бот", base_cost: 30000, dev_days: 3, monthly_cost: 2000 },
            "medium": { name: "Средний функциональный бот", base_cost: 100000, dev_days: 10, monthly_cost: 5000 },
            "complex": { name: "Сложный кастомный бот", base_cost: 300000, dev_days: 30, monthly_cost: 15000 },
            "enterprise": { name: "Enterprise решение", base_cost: 750000, dev_days: 60, monthly_cost: 25000 }
        };

        this.complexitySegments = {
            "faq_processing": {
                "simple": { multiplier: 1.0, cost_impact: 0 },
                "medium": { multiplier: 1.3, cost_impact: 15000 },
                "complex": { multiplier: 1.8, cost_impact: 45000 },
                "expert": { multiplier: 2.5, cost_impact: 80000 }
            },
            "integrations": {
                "basic": { multiplier: 1.0, cost_impact: 0 },
                "advanced": { multiplier: 1.5, cost_impact: 30000 },
                "enterprise": { multiplier: 2.2, cost_impact: 70000 },
                "custom": { multiplier: 3.0, cost_impact: 120000 }
            },
            "analytics": {
                "standard": { multiplier: 1.0, cost_impact: 0 },
                "advanced": { multiplier: 1.4, cost_impact: 20000 },
                "bi_level": { multiplier: 2.0, cost_impact: 50000 },
                "ai_analytics": { multiplier: 2.8, cost_impact: 85000 }
            },
            "nlp": {
                "keyword": { multiplier: 1.0, cost_impact: 0 },
                "simple_nlp": { multiplier: 1.6, cost_impact: 35000 },
                "advanced_nlp": { multiplier: 2.3, cost_impact: 75000 },
                "gpt_powered": { multiplier: 3.2, cost_impact: 150000 }
            },
            "personalization": {
                "none": { multiplier: 1.0, cost_impact: 0 },
                "basic": { multiplier: 1.2, cost_impact: 10000 },
                "smart": { multiplier: 1.7, cost_impact: 40000 },
                "ai_driven": { multiplier: 2.4, cost_impact: 80000 }
            },
            "security": {
                "standard": { multiplier: 1.0, cost_impact: 0 },
                "enhanced": { multiplier: 1.3, cost_impact: 25000 },
                "enterprise": { multiplier: 1.8, cost_impact: 60000 },
                "banking": { multiplier: 2.5, cost_impact: 100000 }
            }
        };

        this.paybackChart = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSliderValues();
        this.calculateROI();
    }

    bindEvents() {
        // Базовые параметры
        const inputs = [
            'botType', 'employees', 'salary', 'monthlyRequests', 
            'handleTime', 'averageCheck', 'currentConversion', 'margin'
        ];
        
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.calculateROI());
                if (element.type === 'number') {
                    element.addEventListener('input', () => this.debounceCalculate());
                }
            }
        });

        // Слайдеры
        const automationSlider = document.getElementById('automationRate');
        const conversionSlider = document.getElementById('conversionIncrease');

        if (automationSlider) {
            automationSlider.addEventListener('input', () => {
                this.updateSliderValues();
                this.debounceCalculate();
            });
        }

        if (conversionSlider) {
            conversionSlider.addEventListener('input', () => {
                this.updateSliderValues();
                this.debounceCalculate();
            });
        }

        // Радиокнопки сложности
        Object.keys(this.complexitySegments).forEach(segment => {
            const radios = document.querySelectorAll(`input[name="${segment}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => this.calculateROI());
            });
        });

        // Debounced calculation для производительности
        this.calculateDebounced = this.debounce(() => this.calculateROI(), 300);
    }

    updateSliderValues() {
        const automationEl = document.getElementById('automationRate');
        const conversionEl = document.getElementById('conversionIncrease');
        const automationVal = automationEl ? automationEl.value : '0';
        const conversionVal = conversionEl ? conversionEl.value : '0';

        const automationRateValueEl = document.getElementById('automationRateValue');
        const conversionIncreaseValueEl = document.getElementById('conversionIncreaseValue');
        if (automationRateValueEl) automationRateValueEl.textContent = `${automationVal}%`;
        if (conversionIncreaseValueEl) conversionIncreaseValueEl.textContent = `${conversionVal}%`;
    }

    debounceCalculate() {
        this.calculateDebounced();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    getInputValue(id) {
        const element = document.getElementById(id);
        return element ? parseFloat(element.value) || 0 : 0;
    }

    getSelectedComplexity() {
        const complexity = {};
        Object.keys(this.complexitySegments).forEach(segment => {
            const selected = document.querySelector(`input[name="${segment}"]:checked`);
            complexity[segment] = selected ? selected.value : Object.keys(this.complexitySegments[segment])[0];
        });
        return complexity;
    }

    calculateCosts() {
        const botType = document.getElementById('botType').value;
        const baseBot = this.botTypes[botType];
        const complexity = this.getSelectedComplexity();

        let totalMultiplier = 1;
        let additionalCosts = 0;

        // Применяем мультипликаторы и дополнительные расходы
        Object.entries(complexity).forEach(([segment, level]) => {
            const segmentData = this.complexitySegments[segment][level];
            totalMultiplier *= segmentData.multiplier;
            additionalCosts += segmentData.cost_impact;
        });

        const developmentCost = (baseBot.base_cost * totalMultiplier) + additionalCosts;
        const monthlyCost = baseBot.monthly_cost * Math.max(totalMultiplier * 0.3, 1);

        return {
            development: Math.round(developmentCost),
            monthly: Math.round(monthlyCost)
        };
    }

    calculateROI() {
        // Получаем все параметры
        const employees = this.getInputValue('employees');
        const salary = this.getInputValue('salary');
        const monthlyRequests = this.getInputValue('monthlyRequests');
        const handleTime = this.getInputValue('handleTime');
        const automationRate = this.getInputValue('automationRate') / 100;
        const conversionIncrease = this.getInputValue('conversionIncrease') / 100;
        const averageCheck = this.getInputValue('averageCheck');
        const currentConversion = this.getInputValue('currentConversion') / 100;
        const margin = this.getInputValue('margin') / 100;

        // Рассчитываем стоимость
        const costs = this.calculateCosts();

        // 1. Экономия ФОТ
        const salaryEconomy = employees * salary * automationRate;

        // 2. Дополнительная выручка от улучшения конверсии
        const additionalConversions = monthlyRequests * conversionIncrease * currentConversion;
        const conversionRevenue = additionalConversions * averageCheck * margin;

        // 3. Дополнительные выгоды (снижение нагрузки, улучшение качества)
        const operationalSavings = (monthlyRequests * handleTime / 60) * 500 * automationRate; // 500₽/час - стоимость времени

        // Общая ежемесячная выгода
        const totalMonthlyBenefit = salaryEconomy + conversionRevenue + operationalSavings;
        const netMonthlyBenefit = totalMonthlyBenefit - costs.monthly;

        // Расчет ROI и окупаемости
        const totalInvestment = costs.development;
        const paybackMonths = netMonthlyBenefit > 0 ? (totalInvestment / netMonthlyBenefit) : Infinity;
        const roi12Months = ((netMonthlyBenefit * 12 - totalInvestment) / totalInvestment) * 100;

        // NPV за 3 года (дисконт 12%)
        const discountRate = 0.12;
        let npv = -totalInvestment;
        for (let month = 1; month <= 36; month++) {
            npv += netMonthlyBenefit / Math.pow(1 + discountRate/12, month);
        }

        // Обновляем интерфейс
        this.updateResults({
            developmentCost: costs.development,
            monthlyCost: costs.monthly,
            salaryEconomy,
            conversionRevenue,
            totalEconomy: totalMonthlyBenefit,
            roi12months: roi12Months,
            paybackPeriod: paybackMonths,
            npv3years: npv,
            netMonthlyBenefit
        });

        // Обновляем график
        this.updateChart(totalInvestment, netMonthlyBenefit);
    }

    updateResults(results) {
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('ru-RU', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Math.round(value)) + '₽';
        };

        const formatPercent = (value) => {
            return new Intl.NumberFormat('ru-RU', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Math.round(value)) + '%';
        };

        const formatMonths = (value) => {
            if (!isFinite(value) || value <= 0) {
                return 'не окупается';
            }
            if (value < 1) {
                return (value * 30).toFixed(0) + ' дн.';
            }
            return value.toFixed(1) + ' мес';
        };

        // Обновляем стоимость
        document.getElementById('developmentCost').textContent = formatCurrency(results.developmentCost);
        document.getElementById('monthlyCost').textContent = formatCurrency(results.monthlyCost) + '/мес';

        // Обновляем результаты
        document.getElementById('salaryEconomy').textContent = formatCurrency(results.salaryEconomy) + '/мес';
        document.getElementById('conversionRevenue').textContent = formatCurrency(results.conversionRevenue) + '/мес';
        document.getElementById('totalEconomy').textContent = formatCurrency(results.totalEconomy) + '/мес';
        document.getElementById('roi12months').textContent = formatPercent(results.roi12months);
        document.getElementById('paybackPeriod').textContent = formatMonths(results.paybackPeriod);
        document.getElementById('npv3years').textContent = formatCurrency(results.npv3years);

        // Цветовая индикация ROI
        const roiElement = document.getElementById('roi12months');
        if (results.roi12months > 500) {
            roiElement.style.color = 'var(--color-success)';
        } else if (results.roi12months > 200) {
            roiElement.style.color = 'var(--color-warning)';
        } else {
            roiElement.style.color = 'var(--color-error)';
        }
    }

    updateChart(initialInvestment, monthlyBenefit) {
        const canvas = document.getElementById('paybackChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Подготавливаем данные для 24 месяцев
        const months = [];
        const cumulativeBenefit = [];
        let cumulative = -initialInvestment;

        for (let i = 0; i <= 24; i++) {
            months.push(i === 0 ? 'Старт' : `${i} мес`);
            if (i > 0) {
                cumulative += monthlyBenefit;
            }
            cumulativeBenefit.push(cumulative);
        }

        // Уничтожаем предыдущий график
        if (this.paybackChart) {
            this.paybackChart.destroy();
        }

        // Создаем новый график
        this.paybackChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Накопленная выгода (₽)',
                    data: cumulativeBenefit,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Точка безубыточности',
                    data: Array(25).fill(0),
                    borderColor: '#B4413C',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('ru-RU', {
                                    style: 'decimal',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value) + '₽';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        backgroundColor: '#1FB8CD'
                    }
                }
            }
        });
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
});

// Дополнительные утилиты для улучшения UX
document.addEventListener('DOMContentLoaded', () => {
    // Анимация появления результатов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Наблюдаем за картами результатов
    document.querySelectorAll('.result-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Плавная прокрутка к результатам при расчете
    let isFirstCalculation = true;
    const originalCalculateROI = ROICalculator.prototype.calculateROI;
    ROICalculator.prototype.calculateROI = function() {
        originalCalculateROI.call(this);
        
        if (isFirstCalculation) {
            setTimeout(() => {
                document.querySelector('.results-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
            isFirstCalculation = false;
        }
    };

    // Валидация полей ввода
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('blur', function() {
            const min = parseFloat(this.getAttribute('min')) || 0;
            const max = parseFloat(this.getAttribute('max')) || Infinity;
            let value = parseFloat(this.value) || 0;

            if (value < min) {
                this.value = min;
                this.style.borderColor = 'var(--color-warning)';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 2000);
            } else if (value > max) {
                this.value = max;
                this.style.borderColor = 'var(--color-warning)';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 2000);
            }
        });
    });

    // Подсказки для сложных параметров
    const tooltips = {
        'employees': 'Количество операторов поддержки, которые могут быть частично заменены ботом',
        'handleTime': 'Среднее время, которое оператор тратит на одно обращение',
        'automationRate': 'Процент обращений, которые бот сможет обработать самостоятельно',
        'conversionIncrease': 'Ожидаемый рост конверсии благодаря улучшению клиентского опыта'
    };

    Object.entries(tooltips).forEach(([id, text]) => {
        const input = document.getElementById(id);
        if (input) {
            input.title = text;
        }
    });
});