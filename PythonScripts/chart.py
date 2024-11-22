import plotly.express as px
import chartUtils

def addExpiryLines(pos):
    shapes = []
    for i in pos:
        shapes.append(dict(
            type="line",
            x0=i,
            x1=i,
            y0=0,
            y1=15,
            line=dict(color="white", width=1, dash="dash")
        ))
    return shapes

def addPeriodLabels(pos):
    labels = []
    period = 1
    for i in pos:
        labels.append(dict(
            x=i,
            y=15,
            text="W"+str(period),
            showarrow=False,
            font=dict(color="white"),
            align="center",
            bgcolor="black",
            borderpad=5,
            borderwidth=1,
            bordercolor='white',
        ))
        period+=1
    return labels

def create(df, month):
    yPositions = chartUtils.lineRefs(month)
    fig = px.line(df)
    fig.update_layout(
        paper_bgcolor="black",
        plot_bgcolor="black",
        font=dict(color="gray"),
        xaxis_title='Price',  # Set X-axis label
        yaxis_title='Date OHLC',
        xaxis=dict(showgrid=False),  # Remove x-axis grid
        yaxis=dict(showgrid=False), 
        shapes=addExpiryLines(yPositions),
        annotations=addPeriodLabels(yPositions)
    )
    fig.update_traces(
        hovertemplate=
        'Price: %{y}<br>'+  # Show Y value with custom label
        'Date OHLC: %{x}<br>',  # Show X value with custom label
    )
    fig.add_annotation
    print(fig.layout.shapes)
    fig.show()